import { IsBoolean, IsNumber, IsString } from 'class-validator';
import { Optional } from '@nestjs/common';

export class RoomDto {
  @IsNumber()
  roomID: number;

  @IsString()
  roomType: string;

  @IsBoolean()
  @Optional()
  occupied: boolean;
}

export class ReservingDto {
  @IsNumber()
  roomID: number;

  @IsString()
  roomType: string;

  @IsString()
  reserveDate: string[];

  @IsNumber()
  reserveTime: number[];
}

export class ReservedInfo {
  @IsString()
  ROOM_ID: string;

  @IsString()
  reservedDate: string;

  @IsString()
  reservedTime: string;
}

export class ModifiedReserveDto {
  @IsNumber()
  ROOM_ID: number;

  @IsString()
  reservedDate: string;

  @IsNumber()
  reservedTime: number;

  @IsString()
  action: string;
}

export class DeleteReserveDto {
  @IsString()
  ADMIN_YN: string;

  @IsNumber()
  CREATE_ID: number;

  @IsString()
  REMARK: string;

  @IsNumber()
  RES_HOUR: number;

  @IsString()
  RES_YYYYMMDD: string;

  @IsNumber()
  ROOM_ID: number;
}
