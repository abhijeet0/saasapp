import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsDate, IsEmail, IsNotEmpty,IsObject,IsString,Matches } from 'class-validator';

export class GenerateEventDto {

  @ApiProperty({ type: Date})
  // @IsNotEmpty()
  // @IsDate()
  start_date: Date;

  @ApiProperty({ type: Date })
  // @IsNotEmpty()
  // @IsDate()
  end_date: Date;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  location: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  summary: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  organizer_name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  organizer_email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  meeting_link: string;

  @ApiProperty({type:[]})
  @IsNotEmpty()
  @IsArray()
  email_to: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email_from: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  email_subject: string;
}