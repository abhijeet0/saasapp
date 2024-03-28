import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty,IsString,Matches, minLength } from 'class-validator';
import { Constants } from '../../utils/constants';
import { Transform } from 'class-transformer';
export class CreateTenantDto {

  @ApiProperty({minLength:Constants.COMPANY_VALIDATION.nameMinLength,maxLength:Constants.COMPANY_VALIDATION.nameMaxLength})
  @IsNotEmpty()
  @IsString()
  @Transform(({value}) => value.toLowerCase())
  company_name: string;

  // @ApiProperty()
  // @IsNotEmpty()
  // @IsString()
  // tenant_id: string;

}