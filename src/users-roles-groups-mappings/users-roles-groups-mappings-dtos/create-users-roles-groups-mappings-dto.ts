import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty,IsString,Matches } from 'class-validator';

export class CreateUsersRolesGroupsMappingDto {

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  user_id: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  role_id: string;

  @ApiProperty()
  @IsString()
  group_id: string;
}