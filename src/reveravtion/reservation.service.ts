import { FilterDto } from './dto/filter.dto';
import { Cookies } from './decorator/cookie.decorator';
import { UserInfoRes } from 'src/user/dto/res/userInfoRes.dto';
import {
  DeleteReserveDto,
  ModifiedReserveDto,
  ReservedInfo,
  ReservingDto,
  RoomDto,
} from './dto/reservatingRoomInfo.dto';
import { Body, Injectable, UnauthorizedException } from '@nestjs/common';
import axios, { AxiosError } from 'axios';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { firstValueFrom, flatMap, from, map, mergeMap, toArray } from 'rxjs';
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

  async searchRoomsByFilter(
    url: string,
    @Body() filter: FilterDto,
    roomID: number,
    @Cookies('user') user: UserInfoRes,
    k: number,
  ): Promise<RoomDto> {
    // https://library.gist.ac.kr/api/v1/mylibrary/facilityreservation/room/20235215?END_DT_YYYYMMDD=20240701&RES_YYYYMMDD=20240621&ROOM_ID=202&START_DT_YYYYMMDD=20240601
    const roomDto: RoomDto = {
      roomID: 0,
      roomType: 'single',
      occupied: false,
    };
    const selectedYear = parseInt(filter.date[k].slice(0, 5));
    const selectedMonth = parseInt(filter.date[k].slice(4, 6));
    const START_DT_YYYYMM =
      selectedYear.toString() + (selectedMonth - 1 == 0)
        ? '01'
        : selectedMonth - 1 < 10
          ? '0' + ((selectedMonth - 1) % 12).toString()
          : ((selectedMonth - 1) % 12).toString();
    const END_DT_YYYYMM =
      selectedYear.toString() + (selectedMonth + 1 == 12)
        ? '12'
        : (selectedMonth + 1) % 12 < 10
          ? '0' + ((selectedMonth + 1) % 12).toString()
          : ((selectedMonth + 1) % 12).toString();
    axios
      .get(url, {
        params: {
          END_DT_YYYYMMDD: END_DT_YYYYMM + '01',
          RES_YYYYMMDD: filter.date[k],
          START_DT_YYYYMMDD: START_DT_YYYYMM + '01',
          ROOM_ID: roomID,
        },
      })
      .then((response) => {
        const roomOther = response.data.roomOther;
        roomDto.roomID = roomID;
        // roomDto.roomType = filter.roomType;
        roomDto.occupied = false;
        for (let i = 0; i < roomOther.length; i++) {
          if (filter.time.find(roomOther[i].RES_HOUR) === undefined) {
            roomDto.occupied = true;
            break;
          }
        }
      });
    return roomDto;
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
          };
        }),
        toArray(),
      ),
    );

    return result;
  }
  async reserveRoom(
    searchUrl: string,
    reserveUrl: string,
    filter: FilterDto,
    reservingDto: ReservingDto,
    @Cookies('user') user: UserInfoRes,
    k: number,
  ): Promise<boolean> {
    const roomDto: RoomDto = await this.searchRoomsByFilter(
      searchUrl,
      filter,
      reservingDto.roomID,
      user,
      k,
    );
    if (roomDto.occupied) return false;
    else {
      const reserveUrl: string =
        'https://library.gist.ac.kr/api/v1/mylibrary/facilityreservation/room/';
      for (let i = 0; i < reservingDto.reserveTime.length; i++) {
        axios.post(reserveUrl, {
          studentID: user.studentNumber,
          ADMIN_YN: 'N',
          CREATE_ID: user.studentNumber,
          REMARK: '전기전자컴퓨터공학부',
          RES_HOUR: reservingDto.reserveTime[i] + '01',
          RES_YYYYMMDD: filter.date[k],
          ROOM_ID: reservingDto.roomID,
        });
      }
    }
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

  async modifyReservation(
    searchUrl: string,
    reserveUrl: string,
    @Cookies('user') user: UserInfoRes,
    @Body() modifiedReserveDto: ModifiedReserveDto[],
  ) {
    for (let i = 0; i < modifiedReserveDto.length; i++) {
      if (modifiedReserveDto[i].action === 'cancel') {
        this.cancelReservation(reserveUrl, user, {
          ADMIN_YN: 'N',
          CREATE_ID: +user.studentNumber,
          REMARK: '전기전자컴퓨터공학부',
          RES_HOUR: modifiedReserveDto[i].reservedTime,
          RES_YYYYMMDD: modifiedReserveDto[i].reservedDate,
          ROOM_ID: modifiedReserveDto[i].ROOM_ID,
        });
      } else if (modifiedReserveDto[i].action === 'reserve') {
        this.reserveRoom(
          searchUrl,
          reserveUrl,
          {
            date: [modifiedReserveDto[i].reservedDate],
            time: [modifiedReserveDto[i].reservedTime],
            floor: modifiedReserveDto[i].ROOM_ID / 100,
          },
          {
            roomID: modifiedReserveDto[i].ROOM_ID,
            reserveDate: [modifiedReserveDto[i].reservedDate],
            reserveTime: [modifiedReserveDto[i].reservedTime],
          },
          user,
          i,
        );
      }
    }
  }

  async cancelReservation(
    url: string,
    @Cookies('user') user: UserInfoRes,
    @Body() deleteReserveDto: DeleteReserveDto,
  ) {
    axios.post(url + user.studentNumber, {
      ADMIN_YN: deleteReserveDto.ADMIN_YN,
      CREATE_ID: deleteReserveDto.CREATE_ID,
      REMARK: deleteReserveDto.REMARK,
      RES_HOUR: deleteReserveDto.RES_HOUR,
      RES_YYYYMMDD: deleteReserveDto.RES_YYYYMMDD,
      ROOM_ID: deleteReserveDto.ROOM_ID,
    });
  }
}
