import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty,IsString,Matches,IsNumber,IsArray,IsOptional } from 'class-validator';
export class UpdateUsersRolesGroupsMappingDto {

  @ApiProperty({required: false})
  @IsOptional()
  @IsString()
  user_id: string;

  @ApiProperty({required: false})
  @IsOptional()
  @IsString()
  role_id: string;

  @ApiProperty({required: false})
  @IsOptional()
  @IsString()
  group_id: string;

  @ApiProperty({required: false})
  @IsOptional()
  @IsNumber()
  is_active: number;

  @ApiProperty({required: false})
  @IsOptional()
  @IsNumber()
  is_delete: number;
}