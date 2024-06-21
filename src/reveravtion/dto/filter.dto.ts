import { IsEnum, IsString } from 'class-validator';
import { RoomType, roomEnum } from '../types/roomType.type';

export class Filter {
  @IsString()
  time: string;

  @IsString()
  @IsEnum(roomEnum)
  roomType: RoomType;
}
