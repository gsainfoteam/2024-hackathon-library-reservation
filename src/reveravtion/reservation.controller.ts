import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
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
import { ApiOAuth2, ApiOkResponse } from '@nestjs/swagger';
import { IdPGuard } from 'src/user/guard/idp.guard';
import { ReservationInfoDto } from './dto/reservation-info.dto';
import { ReservationHistoryDto } from './dto/reservation-history.dto';
import { ReservationSearchQueryDto } from './dto/reservation-search-query.dto';

@Controller('library')
@UseGuards(IdPGuard)
@ApiOAuth2(['email', 'profile', 'openid', 'student_id'], 'oauth2')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Get('me')
  @ApiOkResponse({ type: ReservationInfoDto })
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
    @Query() searchQuery: ReservationSearchQueryDto,
    @GetIdPUser() user: UserInfoRes,
  ) {
    return this.reservationService.generateRoomDtoArray(
      searchQuery,
      user.studentNumber,
    );
  }

  // 호실 예약 : 예약 성공 시 true 반환
  @Post('reserve')
  async reserveRoom(
    @Body() reservingDto: ReservingDto,
    @GetIdPUser() user: UserInfoRes,
  ) {
    return this.reservationService.reserveRoom(
      user.studentNumber,
      reservingDto,
    );
  }

  // 예약 내역 검색 후 예약 내역 DTO 반환
  @Get('history')
  @ApiOkResponse({ type: [ReservationHistoryDto] })
  async getReserveHistory(@GetIdPUser() user: UserInfoRes) {
    return this.reservationService.getReserveHistory(user.studentNumber);
  }

  // 예약 변경
  @Post('modify')
  async modifyReservation(
    searchUrl: string,
    reserveUrl: string,
    @Cookies('user')
    user: UserInfoRes,
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
