import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber, IsString } from 'class-validator';

export class FilterDto {
  @IsString()
  @ApiProperty()
  date: string[];

  @IsNumber()
  @ApiProperty()
  time: number[];

  // @IsString()
  // roomType: string;

  @IsInt()
  @ApiProperty()
  floor: number;
}
