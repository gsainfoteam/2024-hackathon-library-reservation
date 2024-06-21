import { IsBoolean, IsNumber, IsString } from 'class-validator';
import { Optional } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class RoomDto {
  @IsNumber()
  @ApiProperty()
  roomID: number;

  @ApiProperty()
  @IsString()
  roomType: string;

  @ApiProperty()
  @IsBoolean()
  @Optional()
  occupied: boolean;
}

export class ReservingDto {
  @ApiProperty()
  @IsNumber()
  roomID: number;

  // @IsString()
  // roomType: string;

  @ApiProperty()
  @IsString()
  reserveDate: string[];

  @ApiProperty()
  @IsNumber()
  reserveTime: number[];
}

export class ReservedInfo {
  @ApiProperty()
  @IsString()
  ROOM_ID: string;

  @ApiProperty()
  @IsString()
  reservedDate: string;

  @ApiProperty()
  @IsString()
  reservedTime: string;
}

export class ModifiedReserveDto {
  @ApiProperty()
  @IsNumber()
  ROOM_ID: number;

  @ApiProperty()
  @IsString()
  reservedDate: string;

  @ApiProperty()
  @IsNumber()
  reservedTime: number;

  @ApiProperty()
  @IsString()
  action: string;
}

export class DeleteReserveDto {
  @ApiProperty()
  @IsString()
  ADMIN_YN: string;

  @ApiProperty()
  @IsNumber()
  CREATE_ID: number;

  @ApiProperty()
  @IsString()
  REMARK: string;

  @ApiProperty()
  @IsNumber()
  RES_HOUR: number;

  @ApiProperty()
  @IsString()
  RES_YYYYMMDD: string;

  @ApiProperty()
  @IsNumber()
  ROOM_ID: number;
}
