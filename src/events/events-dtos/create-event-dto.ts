import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsDate, IsEmail, IsNotEmpty,IsObject,IsString,Matches } from 'class-validator';

export class CreateEventDto {

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Transform(({value}) => value.toLowerCase())
  summary: string;

  @ApiProperty({type:Date})
  @IsNotEmpty()
  // @IsDate()
  start_date: Date;

  @ApiProperty({type:Date})
  @IsNotEmpty()
  // @IsDate()
  end_date: Date;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Transform(({value}) => value.toLowerCase())
  type: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsObject()
  event_details: Object;

}