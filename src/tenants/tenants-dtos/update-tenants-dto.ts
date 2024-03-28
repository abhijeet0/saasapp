import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty,IsString,Matches,IsNumber,IsArray, IsOptional, Min, Max, Length } from 'class-validator';
import { Constants } from '../../utils/constants';import { Transform } from 'class-transformer';
export class UpdateTenantDto {

    @ApiProperty({required: false})
    @IsString()
    @IsOptional()
    @Length(Constants.COMPANY_VALIDATION.nameMinLength,Constants.COMPANY_VALIDATION.nameMaxLength)
    @Transform(({value}) => value.toLowerCase())
    company_name: string;
  
    // @ApiProperty({required: false})
    // @IsOptional()
    // @IsString()
    // @Transform(({value}) => value.toLowerCase())
    // tenant_id: string;

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