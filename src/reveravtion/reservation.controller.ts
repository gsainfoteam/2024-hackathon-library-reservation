import { Body, Controller, Post } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { InjectPage } from 'nest-puppeteer';
import { Page } from 'puppeteer';
import { ReservingDto, RoomDto } from './dto/reservatingRoomInfo.dto';
import { Cookies } from './decorator/cookie.decorator';
import { UserInfoRes } from 'src/user/dto/res/userInfoRes.dto';
import { FilterDto } from './dto/filter.dto';
import { LoginDto } from './dto/login.dto';

@Controller('library')
export class ReservationController {
  constructor(
    private readonly reservationService: ReservationService,
    @InjectPage() private readonly page: Page,
  ) {}

  //도서관 로그인 + AccessToken 받음
  @Post('get-token')
  async getToken(@Body() loginDto: LoginDto) {
    return this.reservationService.getToken(loginDto);
  }

  // 지스트 도서관에서 특정 날짜, 호실 종류를 검색
  @Post('reserve')
  async searchRoomsByFilter(
    url: string,
    @Body() filter: FilterDto,
    roomID: number,
    @Cookies('user') user: UserInfoRes,
  ): Promise<RoomDto> {
    return this.reservationService.searchRoomsByFilter(
      url,
      filter,
      roomID,
      user,
    );
  }

  // 호실 DTO 배열을 생성
  async generateRoomDtoArray(
    url: string,
    filter: FilterDto,
    @Cookies('user') user: UserInfoRes,
  ) {
    return this.reservationService.generateRoomDtoArray(url, filter, user);
  }

  // 호실 예약 : 예약 성공 시 true 반환
  async reserveRoom(
    searchUrl: string,
    reserveUrl: string,
    filter: FilterDto,
    reservingDto: ReservingDto,
    @Cookies('user') user: UserInfoRes,
  ): Promise<boolean> {
    return this.reservationService.reserveRoom(
      searchUrl,
      reserveUrl,
      filter,
      reservingDto,
      user,
    );
  }

  // 호실 반복 예약

  // 예약 내역 검색 후 예약 내역 DTO 반환

  // 예약 변경

  // 예약 취소
}
