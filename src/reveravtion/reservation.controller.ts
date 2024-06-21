import { Body, Controller, Post } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { InjectPage } from 'nest-puppeteer';
import { Page } from 'puppeteer';
import { ReservingDto, RoomDto } from './dto/reservatingRoomInfo.dto';
import { Cookies } from './decorator/cookie.decorator';
import { UserInfoRes } from 'src/user/dto/res/userInfoRes.dto';
import { FilterDto } from './dto/filter.dto';

@Controller('library')
export class ReservationController {
  constructor(
    private readonly reservationService: ReservationService,
    @InjectPage() private readonly page: Page,
  ) {}

  // 지스트 도서관에서 특정 날짜, 호실 종류를 검색
  @Post('reserve')
  async searchRoomsByFilter(
    url: string,
    @Body() filter: FilterDto,
    roomID: number,
    @Cookies('user') user: UserInfoRes,
  ): Promise<RoomDto> {
    // https://library.gist.ac.kr/api/v1/mylibrary/facilityreservation/room/20235215?END_DT_YYYYMMDD=20240701&RES_YYYYMMDD=20240621&ROOM_ID=202&START_DT_YYYYMMDD=20240601
    const selectedYear = parseInt(filter.date.slice(0, 5));
    const selectedMonth = parseInt(filter.date.slice(4, 6));
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
    const query =
      'studentID' +
      user.studentNumber +
      '?END_DT_YYYYMMDD=' +
      END_DT_YYYYMM +
      '01' +
      '&RES_YYYYMMDD=' +
      filter.date +
      '&ROOM_ID=' +
      roomID +
      '&START_DT_YYYYMMDD=' +
      START_DT_YYYYMM +
      '01';
    // await this.page.goto(url);
    // const content = await this.page.content();
    const response = await this.page.waitForResponse(
      (response) => response.url() === url + query,
    );
    const responseJson = await response.json();
    // console.log(responseJson.roomOther);

    const roomDto: RoomDto = {
      roomID: roomID,
      roomType: filter.roomType,
      occupied: false,
    };

    // responseJson에서 roomOther 속성 정보를 읽어서 유저가 원하는 시간대에 예약되어 있는지 확인
    // 만약 예약되어 있다면 roomDto.occupied를 true로, 그렇지 않다면 false로
    for (let i = 0; i < responseJson.roomOther.length; i++)
      if (filter.time.find(responseJson.roomOther[i].RES_HOUR) === undefined) {
        roomDto.occupied = true;
        break;
      }

    return roomDto;
  }

  // 호실 DTO 배열을 생성
  async generateRoomDtoArray(
    url: string,
    filter: FilterDto,
    @Cookies('user') user: UserInfoRes,
  ) {
    const roomIDs: number[][] = [[], [], [], []];

    roomIDs[1].push(108);
    roomIDs[1].push(110);

    for (let i = 202; i <= 210; i++) roomIDs[2].push(i);
    for (let i = 219; i <= 240; i++) roomIDs[2].push(i);

    roomIDs[3].push(302);
    roomIDs[3].push(303);
    roomIDs[3].push(305);
    roomIDs[3].push(306);
    roomIDs[3].push(307);
    roomIDs[3].push(310);

    for (let i = 406; i <= 409; i++) roomIDs[4].push(i);

    const rooms: RoomDto[] = [];

    for (let i = 0; i < roomIDs[filter.floor].length; i++) {
      rooms.push(
        await this.searchRoomsByFilter(
          url,
          filter,
          roomIDs[filter.floor][i],
          user,
        ),
      );
    }
    return rooms;
  }

  // 호실 예약 : 예약 성공 시 true 반환
  async reserveRoom(
    searchUrl: string,
    reserveUrl: string,
    filter: FilterDto,
    reservingDto: ReservingDto,
    @Cookies('user') user: UserInfoRes,
  ): Promise<boolean> {
    const roomDto: RoomDto = await this.searchRoomsByFilter(
      searchUrl,
      filter,
      reservingDto.roomID,
      user,
    );
    if (roomDto.occupied) return false;
    else {
      const reserveUrl: string =
        'https://library.gist.ac.kr/api/v1/mylibrary/facilityreservation/room/';
      const selectedYear = parseInt(filter.date.slice(0, 5));
      const selectedMonth = parseInt(filter.date.slice(4, 6));
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
      for (let i = 0; i < reservingDto.ReserveAt.length; i++) {
        const query =
          'studentID' +
          user.studentNumber +
          '?END_DT_YYYYMMDD=' +
          END_DT_YYYYMM +
          '01' +
          '&RES_YYYYMMDD=' +
          filter.date +
          '&ROOM_ID=' +
          reservingDto.roomID +
          '&START_DT_YYYYMMDD=' +
          START_DT_YYYYMM +
          '01';
      }

      return true;
    }
  }

  // 호실 반복 예약

  // 예약 내역 검색 후 예약 내역 DTO 반환

  // 예약 변경

  // 예약 취소
}
