import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty,IsObject,IsString,Matches } from 'class-validator';
import { Constants } from '../../utils/constants';
import { Transform } from 'class-transformer';

export class CreateGroupsDto {

  @ApiProperty({minLength:Constants.GROUPS_VALIDATION.nameMinLength,maxLength:Constants.GROUPS_VALIDATION.nameMaxLength})
  @IsNotEmpty()
  @IsString()
  @Transform(({value}) => value.toLowerCase())
  @Matches(/^[A-Za-z]+$/, { message: 'name should contain only characters' })
  name: string;

  @ApiProperty({type:Object})
  @IsNotEmpty()
  @IsObject()
  permissions: Object;

}