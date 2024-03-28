import { ApiProperty } from '@nestjs/swagger';
import { IsNumber,IsOptional,IsString } from 'class-validator';

export class GetAllRequestForDemoDto {

  @ApiProperty({type:Number,required:false})
  // @IsNumber()
  @IsOptional()
  page?: number;
  
  @ApiProperty({type:Number,required:false})
  // @IsNumber()
  @IsOptional()
  size?: number;
  
  @ApiProperty({required: false,type:String})
  @IsOptional()
  @IsString()
  filters?: string;
    
}