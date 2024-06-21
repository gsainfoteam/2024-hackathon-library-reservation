import { ApiProperty } from '@nestjs/swagger';

export class ReservationHistoryDto {
  @ApiProperty()
  roomId: number;
  @ApiProperty()
  reservedDate: string;
  @ApiProperty()
  reservedTime: number;
}
