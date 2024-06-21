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
  roomType: string;

  @IsBoolean()
  repeated: boolean;

  @IsString()
  roomID: string;

  @IsString()
  reservedDate: string;

  @IsString()
  reservedTime: string;
}

export class DeleteReserveDto {}
