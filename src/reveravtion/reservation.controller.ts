import { Body, Controller, Post } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import {
  DeleteReserveDto,
  ReservedInfo,
  ReservingDto,
  RoomDto,
} from './dto/reservatingRoomInfo.dto';
import { Cookies } from './decorator/cookie.decorator';
import { UserInfoRes } from 'src/user/dto/res/userInfoRes.dto';
import { FilterDto } from './dto/filter.dto';

@Controller('library')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  // 지스트 도서관에서 특정 날짜, 호실 종류를 검색
  @Post('reserve')
  async searchRoomsByFilter(
    url: string,
    @Body() filter: FilterDto,
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
  async getReserveHistory(
    url: string,
    @Cookies('user') user: UserInfoRes,
  ): Promise<ReservedInfo[]> {
    return this.reservationService.getReserveHistory(url, user);
  }

  // 예약 변경
  async modifyReservation() {}

  // 예약 취소
  async cancelReservation(
    url: string,
    @Cookies('user') user: UserInfoRes,
    @Body() deleteReserveDto: DeleteReserveDto,
  ) {}
}
