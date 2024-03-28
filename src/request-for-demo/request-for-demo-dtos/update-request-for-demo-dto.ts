import { ApiTags,ApiOperation,ApiQuery,ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty,IsNumber,IsObject,IsOptional,IsString,Matches, Max, Min } from 'class-validator';
import { Constants } from '../../utils/constants';
import { Transform } from 'class-transformer';
export class UpdateRequestForDemoDto {

  @ApiProperty({required: false,minLength:Constants.REQUEST_FOR_DEMO_VALIDATION.firstNameMinLength,maxLength:Constants.REQUEST_FOR_DEMO_VALIDATION.firstNameMaxLength})
  @IsOptional()
  @IsString()
  @Transform(({value}) => value.toLowerCase())
  @Matches(/^[A-Za-z]+$/, { message: 'Input should contain only characters' })
  first_name: string;

  @ApiProperty({required: false,minLength:Constants.REQUEST_FOR_DEMO_VALIDATION.lastNameMinLength,maxLength:Constants.REQUEST_FOR_DEMO_VALIDATION.lastNameMaxLength})
  @IsOptional()
  @IsString()
  @Transform(({value}) => value.toLowerCase())
  @Matches(/^[A-Za-z]+$/, { message: 'Input should contain only characters' })
  last_name: string;

  @ApiProperty({required: false,minLength:Constants.REQUEST_FOR_DEMO_VALIDATION.statusMinLength,maxLength:Constants.REQUEST_FOR_DEMO_VALIDATION.statusMaxLength})
  @IsOptional()
  @IsString()
  @Transform(({value}) => value.toLowerCase())
  @Matches(/^[A-Za-z]+$/, { message: 'Input should contain only characters' })
  status: string;

  @ApiProperty({required: false,minLength:Constants.REQUEST_FOR_DEMO_VALIDATION.emailMinLength,maxLength:Constants.REQUEST_FOR_DEMO_VALIDATION.emailMaxLength})
  @IsOptional()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({required: false})
  @IsString()
  @Matches(/^([0|\+[0-9]{1,5})?([7-9][0-9]{9})$/, { message: 'Please Enter Valid Number' })
  mobile: string;

  @ApiProperty({required: false})
  @IsObject()
  event_details: {
    start_date:any,
    end_date:any,
    start_time:any,
    end_time:any
  };

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
