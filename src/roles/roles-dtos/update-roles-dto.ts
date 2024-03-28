import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty,IsString,Matches,IsNumber,IsArray, IsOptional, Min, Max, Length, IsObject } from 'class-validator';
import { Constants } from '../../utils/constants';import { Transform } from 'class-transformer';
export class UpdateRoleDto {

    @ApiProperty({required: false})
    @IsString()
    @IsOptional()
    @Length(Constants.ROLES_VALIDATION.nameMinLength,Constants.ROLES_VALIDATION.nameMaxLength)
    @Transform(({value}) => value.toLowerCase())
    @Matches(/^[A-Za-z]+$/, { message: 'name should contain only characters' })
    name: string;
  
    @ApiProperty({required: false})
    @IsOptional()
    @IsObject()
    permissions: Object;

    @ApiProperty({required: false})
    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(1)
    is_active: number;
  
    @ApiProperty({required: false})
    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(1)
    is_delete: number;
  }