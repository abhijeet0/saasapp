import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty,IsString,Matches,IsNumber,IsArray, IsEmail, IsOptional, Length, Min, Max } from 'class-validator';
import { Transform } from 'class-transformer';
import { Constants } from '../../utils/constants';export class UpdateUserDto {

    @ApiProperty()
    @IsString()
    @Length(Constants.USERS_VALIDATION.nameMinLength,Constants.USERS_VALIDATION.nameMaxLength)
    @Transform(({value}) => value.toLowerCase())
    @Matches(/^[A-Za-z]+$/, { message: 'name should contain only characters' })
    first_name: string;

    @ApiProperty()
    @IsString()
    @Length(Constants.USERS_VALIDATION.nameMinLength,Constants.USERS_VALIDATION.nameMaxLength)
    @Transform(({value}) => value.toLowerCase())
    @Matches(/^[A-Za-z]+$/, { message: 'name should contain only characters' })
    last_name: string;
  
    @ApiProperty()
    @IsString()
    @Transform(({value}) => value.toLowerCase())
    organization: string;
  
    @ApiProperty()
    @IsString()
    @Transform(({value}) => value.toLowerCase())
    designation: string;
  
    @ApiProperty()
    @IsString()
    @Transform(({value}) => value.toLowerCase())
    country: string;
    
    @ApiProperty()
    @IsEmail()
    @IsOptional()
    @Length(Constants.USERS_VALIDATION.emailMinLength,Constants.USERS_VALIDATION.emailMaxLength)
    email: string;

    @ApiProperty()
    @IsString()
    @Length(Constants.USERS_VALIDATION.passwordMinLength,Constants.USERS_VALIDATION.passwordMaxLength)
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]*$/, { message: 'The password must include a combination of uppercase and lowercase letters, numbers, and special characters' })
    @IsOptional()
    password: string;

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