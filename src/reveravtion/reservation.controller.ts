import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { ReservingDto } from './dto/reservatingRoomInfo.dto';
import { UserInfoRes } from 'src/user/dto/res/userInfoRes.dto';
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

  // 예약 취소
  @Delete('cancel')
  async cancelReservation(
    @Body() reservingDto: ReservingDto,
    @GetIdPUser() user: UserInfoRes,
  ) {
    return this.reservationService.cancelReservation(
      user.studentNumber,
      reservingDto,
    );
  }
}
