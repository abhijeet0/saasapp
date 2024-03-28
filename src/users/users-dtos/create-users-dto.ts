import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty,IsString,Matches,IsEmail, Length } from 'class-validator';
import { Constants } from '../../utils/constants';
import { Transform } from 'class-transformer';

export class CreateUserDto {

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Transform(({value}) => value.toLowerCase())
  @Length(Constants.USERS_VALIDATION.nameMinLength,Constants.USERS_VALIDATION.nameMaxLength)
  @Matches(/^[A-Za-z]+$/, { message: 'name should contain only characters' })
  first_name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Transform(({value}) => value.toLowerCase())
  @Length(Constants.USERS_VALIDATION.nameMinLength,Constants.USERS_VALIDATION.nameMaxLength)
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
  @IsNotEmpty()
  @Length(Constants.USERS_VALIDATION.emailMinLength,Constants.USERS_VALIDATION.emailMaxLength)
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(Constants.USERS_VALIDATION.passwordMinLength,Constants.USERS_VALIDATION.passwordMaxLength)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]*$/, { message: 'The password must include a combination of uppercase and lowercase letters, numbers, and special characters' })
  password: string;

  @ApiProperty()
  @IsString()
  azure_user_id: string;
}