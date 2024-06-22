import { ReservingDto } from './dto/reservatingRoomInfo.dto';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AxiosError } from 'axios';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import {
  firstValueFrom,
  from,
  lastValueFrom,
  map,
  mergeMap,
  toArray,
} from 'rxjs';
import { LoginDto } from './dto/login.dto';
import { ReservationInfo } from './types/reservation-info.type';
import { ReservationInfoDto } from './dto/reservation-info.dto';
import dayjs from 'dayjs';
import { ReservationHistory } from './types/reservation-history.type';
import { ReservationSearchQueryDto } from './dto/reservation-search-query.dto';
import { RoomGroup } from './types/room-group.type';
import { ReservationSearch } from './types/reservation-search.type';

@Injectable()
export class ReservationService {
  constructor(private readonly httpService: HttpService) {}

  async getRooms(studentID: string) {
    const response = await firstValueFrom(
      this.httpService.get<ReservationInfo>(
        `/api/v1/mylibrary/facilityreservation/info/${studentID}`,
      ),
    );
    return response.data.facility;
  }

  async getInfoByStudentId(studentID: string): Promise<ReservationInfoDto> {
    const response = await firstValueFrom(
      this.httpService.get<ReservationInfo>(
        `/api/v1/mylibrary/facilityreservation/info/${studentID}`,
      ),
    );
    const info = response.data.info[0];
    return {
      userId: info.USER_ID,
      userName: info.USER_NM,
      koreanName: info.KOREAN_NM,
      departmentName: info.DEPARTMENT_NM,
      availableInDay: info.FAC_DUR4,
      availableInMonth: info.FAC_DUR5,
    };
  }

  async getToken(loginDto: LoginDto): Promise<AxiosResponse> {
    const url = 'https://library.gist.ac.kr/oauth/token';

    const response = await firstValueFrom(
      this.httpService.post(
        url,
        {
          client_id: 'web',
          grant_type: 'password',
          username: loginDto.username,
          password: loginDto.password,
        },
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
      ),
    ).catch((error) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 400) {
          throw new UnauthorizedException();
        }
      }
      throw error;
    });
    return response.data;
  }

  async checkRoomOccupied({
    studentID,
    roomID,
    reserveFrom,
    reserveTo,
    reserveDate,
  }: {
    studentID: string;
    roomID: string;
    reserveFrom: number;
    reserveTo: number;
    reserveDate: string;
  }) {
    const times = new Set(
      [...Array(reserveTo - reserveFrom + 1)].map((_, i) => i + reserveFrom),
    );
    const result = await firstValueFrom(
      this.httpService
        .get<ReservationSearch>(
          `api/v1/mylibrary/facilityreservation/room/${studentID}`,
          {
            params: {
              RES_YYYYMMDD: reserveDate,
              ROOM_ID: roomID,
            },
          },
        )
        .pipe(
          map((res) => {
            const reservedTimes = res.data.roomOther.map((r) => r.RES_HOUR);
            const occupied = reservedTimes.some((i) => times.has(i));
            return occupied;
          }),
        ),
    );
    return result;
  }

  async generateRoomDtoArray(
    {
      reserveDate,
      roomGroup,
      reserveFrom,
      reserveTo,
    }: ReservationSearchQueryDto,
    studentID: string,
  ) {
    const roomGroupId = RoomGroup[roomGroup];
    const roomIds = (await this.getRooms(studentID))
      .filter((room) => room.ROOM_GROUP === roomGroupId)
      .map((room) => room.ROOM_ID);

    const times = new Set(
      [...Array(reserveTo - reserveFrom + 1)].map((_, i) => i + reserveFrom),
    );
    const result = await firstValueFrom(
      from(roomIds).pipe(
        mergeMap((roomId) =>
          this.httpService.get<ReservationSearch>(
            `api/v1/mylibrary/facilityreservation/room/${studentID}`,
            { params: { RES_YYYYMMDD: reserveDate[0], ROOM_ID: roomId } },
          ),
        ),
        map((res) => {
          const reservedTimes = res.data.roomOther.map((r) => r.RES_HOUR);
          const occupied = reservedTimes.some((i) => times.has(i));
          return {
            roomId: res.data.normalRoomGroupDates[0].ROOM_ID,
            occupied,
            reservedTimes,
            myTimes: res.data.room.map((r) => r.RES_HOUR),
          };
        }),
        toArray(),
      ),
    );

    return result;
  }

  async reserveRoom(studentNumber: string, reserveDto: ReservingDto) {
    const info = await this.getInfoByStudentId(studentNumber);

    await lastValueFrom(
      from(reserveDto.reserveTimes).pipe(
        mergeMap((hour) =>
          this.httpService.post(
            `api/v1/mylibrary/facilityreservation/room/${studentNumber}`,
            undefined,
            {
              params: {
                ADMIN_YN: 'N',
                CREATE_ID: studentNumber,
                REMARK: info.departmentName,
                RES_HOUR: hour,
                RES_YYYYMMDD: reserveDto.reserveDate,
                ROOM_ID: reserveDto.roomID,
              },
            },
          ),
        ),
        toArray(),
      ),
    );
    return true;
  }

  async getReserveHistory(studentID: string) {
    const START_DT = dayjs().format('YYYYMMDD');
    const END_DT = dayjs().add(1, 'y').format('YYYYMMDD');
    const response = await firstValueFrom(
      this.httpService.get<{
        result: ReservationHistory[];
      }>(`api/v1/mylibrary/facilityreservation/search/${studentID}`, {
        params: { START_DT, END_DT },
      }),
    );

    return response.data.result.map((history) => ({
      roomId: history.ROOM_ID,
      reservedDate: history.RES_YYYYMMDD,
      reservedTime: history.RES_HOUR,
    }));
  }

  async cancelReservation(studentNumber: string, reserveDto: ReservingDto) {
    const response = await firstValueFrom(
      this.httpService.get<{
        result: ReservationHistory[];
      }>(`api/v1/mylibrary/facilityreservation/search/${studentNumber}`, {
        params: {
          START_DT: reserveDto.reserveDate,
          END_DT: reserveDto.reserveDate,
        },
      }),
    );
    const toCancel = response.data.result.filter(
      ({ ROOM_ID, RES_HOUR }) =>
        ROOM_ID === reserveDto.roomID &&
        reserveDto.reserveTimes.includes(RES_HOUR),
    );

    await lastValueFrom(
      from(toCancel).pipe(
        mergeMap((history) =>
          this.httpService.delete(
            `api/v1/mylibrary/facilityreservation/room/${studentNumber}`,
            {
              params: {
                RES_ID: history.RES_ID,
                RES_HOUR: history.RES_HOUR,
                RES_YYYYMMDD: history.RES_YYYYMMDD,
                ROOM_ID: history.ROOM_ID,
              },
            },
          ),
        ),
        toArray(),
      ),
    );
    return true;
  }
}
