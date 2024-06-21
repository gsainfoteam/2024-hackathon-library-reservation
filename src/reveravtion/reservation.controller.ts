import { Body, Controller, Get, Post } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import {
  DeleteReserveDto,
  ModifiedReserveDto,
  ReservedInfo,
  ReservingDto,
  RoomDto,
} from './dto/reservatingRoomInfo.dto';
import { Cookies } from './decorator/cookie.decorator';
import { UserInfoRes } from 'src/user/dto/res/userInfoRes.dto';
import { FilterDto } from './dto/filter.dto';
import { LoginDto } from './dto/login.dto';
import { GetIdPUser } from 'src/user/decorator/get-idp-user.decorator';

@Controller('library')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Get('me')
  async getInfo(@GetIdPUser() user: UserInfoRes) {
    return this.reservationService.getInfoByStudentId(user.studentNumber);
  }

  //도서관 로그인 + AccessToken 받음
  @Post('get-token')
  async getToken(@Body() loginDto: LoginDto) {
    return this.reservationService.getToken(loginDto);
  }

  // 지스트 도서관에서 특정 날짜, 호실 종류를 검색
  async searchRoomsByFilter(
    url: string,
    filter: FilterDto,
    roomID: number,
    @Cookies('user') user: UserInfoRes,
    k: number,
  ): Promise<RoomDto> {
    return this.reservationService.searchRoomsByFilter(
      url,
      filter,
      roomID,
      user,
      k,
    );
  }

  // 호실 DTO 배열을 생성
  @Get('search')
  async generateRoomDtoArray(
    @Body('url') url: string,
    @Body('filterDto') filter: FilterDto,
    @Cookies('user') user: UserInfoRes,
  ) {
    return this.reservationService.generateRoomDtoArray(url, filter, user);
  }

  // 호실 예약 : 예약 성공 시 true 반환
  @Post('reserve')
  async reserveRoom(
    searchUrl: string,
    reserveUrl: string,
    filter: FilterDto,
    reservingDto: ReservingDto,
    @Cookies('user') user: UserInfoRes,
  ) {
    for (let i = 0; i < reservingDto.reserveDate.length; i++) {
      this.reservationService.reserveRoom(
        searchUrl,
        reserveUrl,
        filter,
        reservingDto,
        user,
        i,
      );
    }
  }

  // 예약 내역 검색 후 예약 내역 DTO 반환
  @Get('history')
  async getReserveHistory(
    url: string,
    @Cookies('user') user: UserInfoRes,
  ): Promise<ReservedInfo[]> {
    return this.reservationService.getReserveHistory(url, user);
  }

  // 예약 변경
  @Post('modify')
  async modifyReservation(
    searchUrl: string,
    reserveUrl: string,
    @Cookies('user') user: UserInfoRes,
    @Body() modifiedReserveDto: ModifiedReserveDto[],
  ) {
    return this.reservationService.modifyReservation(
      searchUrl,
      reserveUrl,
      user,
      modifiedReserveDto,
    );
  }

  // 예약 취소
  @Post('cancel')
  async cancelReservation(
    url: string,
    @Cookies('user') user: UserInfoRes,
    @Body() deleteReserveDto: DeleteReserveDto,
  ) {
    return this.reservationService.cancelReservation(
      url,
      user,
      deleteReserveDto,
    );
  }
}
