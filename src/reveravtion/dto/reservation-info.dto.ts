import { ApiProperty } from '@nestjs/swagger';

export class ReservationInfoDto {
  @ApiProperty({ example: '20235140' })
  userId: string;
  @ApiProperty({ example: '이보성' })
  userName: string;
  @ApiProperty({ example: '학부생' })
  koreanName: string;
  @ApiProperty({ example: '기초교육학부' })
  departmentName: string;
  @ApiProperty({ example: 8 })
  availableInDay: number;
  @ApiProperty({ example: 200 })
  availableInMonth: number;
}
