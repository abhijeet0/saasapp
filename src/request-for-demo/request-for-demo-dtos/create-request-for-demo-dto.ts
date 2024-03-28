import { ApiTags,ApiOperation,ApiQuery,ApiProperty } from '@nestjs/swagger';
import { IsDate, IsEmail, IsNotEmpty,IsNumber,IsObject,IsOptional,IsString,Matches } from 'class-validator';
import { Constants } from '../../utils/constants';
import { Transform } from 'class-transformer';
export class CreateRequestForDemoDto {

  @ApiProperty({minLength:Constants.REQUEST_FOR_DEMO_VALIDATION.firstNameMinLength,maxLength:Constants.REQUEST_FOR_DEMO_VALIDATION.firstNameMaxLength})
  @IsString()
  @Transform(({value}) => value.toLowerCase())
  @Matches(/^[A-Za-z]+$/, { message: 'Input should contain only characters' })
  first_name: string;

  @ApiProperty({minLength:Constants.REQUEST_FOR_DEMO_VALIDATION.lastNameMinLength,maxLength:Constants.REQUEST_FOR_DEMO_VALIDATION.lastNameMaxLength})
  @IsString()
  @Transform(({value}) => value.toLowerCase())
  @Matches(/^[A-Za-z]+$/, { message: 'Input should contain only characters' })
  last_name: string;

  @ApiProperty({minLength:Constants.REQUEST_FOR_DEMO_VALIDATION.statusMinLength,maxLength:Constants.REQUEST_FOR_DEMO_VALIDATION.statusMaxLength})
  @IsString()
  @Transform(({value}) => value.toLowerCase())
  @Matches(/^[A-Za-z]+$/, { message: 'Input should contain only characters' })
  status: string;

  @ApiProperty({minLength:Constants.REQUEST_FOR_DEMO_VALIDATION.emailMinLength,maxLength:Constants.REQUEST_FOR_DEMO_VALIDATION.emailMaxLength})
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({minLength:Constants.REQUEST_FOR_DEMO_VALIDATION.lastNameMinLength,maxLength:Constants.REQUEST_FOR_DEMO_VALIDATION.lastNameMaxLength})
  @IsString()
  @Transform(({value}) => value.toLowerCase())
  organization_name: string;

  @ApiProperty({minLength:Constants.REQUEST_FOR_DEMO_VALIDATION.lastNameMinLength,maxLength:Constants.REQUEST_FOR_DEMO_VALIDATION.lastNameMaxLength})
  @IsString()
  @Transform(({value}) => value.toLowerCase())
  designation: string;

  @ApiProperty({minLength:Constants.REQUEST_FOR_DEMO_VALIDATION.lastNameMinLength,maxLength:Constants.REQUEST_FOR_DEMO_VALIDATION.lastNameMaxLength})
  @IsString()
  @Transform(({value}) => value.toLowerCase())
  country: string;

  @ApiProperty()
  @IsString()
  @Matches(/^([0|\+[0-9]{1,5})?([7-9][0-9]{9})$/, { message: 'Please Enter Valid Number' })
  mobile: string;

  @ApiProperty({})  
  @IsObject()
  event_details: {
    start_date:any,
    end_date:any,
    start_time:any,
    end_time:any
  };
  
}
