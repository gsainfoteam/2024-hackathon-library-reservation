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

  @IsNumber()
  ReserveAt: number[];
}

export class ReservedInfo {
  @IsString()
  roomType: string;

  @IsString()
  reservedDate: string;

  @IsBoolean()
  repeated: boolean;

  @IsString()
  roomID: string;

  @IsString()
  reservedTime: string[];
}
