import { IsInt, IsNumber, IsString } from 'class-validator';

export class FilterDto {
  @IsString()
  date: string[];

  @IsNumber()
  time: number[];

  @IsString()
  roomType: string;

  @IsInt()
  floor: number;
}
