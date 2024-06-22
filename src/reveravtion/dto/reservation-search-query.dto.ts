import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsEnum, IsNumber, IsString } from 'class-validator';
import { RoomGroup, RoomGroupType } from '../types/room-group.type';

export class ReservationSearchQueryDto {
  @ApiProperty({ enum: Object.keys(RoomGroup) })
  @IsEnum(Object.keys(RoomGroup))
  roomGroup: RoomGroupType;

  @ApiProperty({ example: '20240622,20240623' })
  @IsString({ each: true })
  @Transform(({ value }) => value.toString().split(',').map(String))
  reserveDate: string[];

  @ApiProperty({ example: 9 })
  @IsNumber()
  @Type(() => Number)
  reserveFrom: number;

  @ApiProperty({ example: 14 })
  @IsNumber()
  @Type(() => Number)
  reserveTo: number;
}
