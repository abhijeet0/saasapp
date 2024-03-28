import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty,IsObject,IsString,Matches, minLength } from 'class-validator';
import { Constants } from '../../utils/constants';
import { Transform } from 'class-transformer';
export class CreateRolesDto {

  @ApiProperty({minLength:Constants.ROLES_VALIDATION.nameMinLength,maxLength:Constants.ROLES_VALIDATION.nameMaxLength})
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