import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty,IsString,Matches,IsNumber,IsArray, IsOptional, IsObject } from 'class-validator';
import { Constants } from '../../utils/constants';export class UpdateGroupsDto {

    @ApiProperty({required: false,type:String})
    @IsOptional()
    @IsString()
    @Matches(/^[A-Za-z]+$/, { message: 'name should contain only characters' })
    name: string;
  
    @ApiProperty({required:false})
    @IsOptional()
    @IsObject()
    permissions: Object;

    @ApiProperty({required: false,maxLength:Constants.IS_ACTIVE_LENGTH})
    @IsOptional()
    @IsNumber()
    is_active: number;

    @ApiProperty({required: false,maxLength:Constants.IS_DELETE_LENGTH})
    @IsOptional()
    @IsNumber()
    is_delete: number;
  }