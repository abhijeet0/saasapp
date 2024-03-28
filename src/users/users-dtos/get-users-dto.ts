import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsDate, IsEmail, IsNotEmpty,IsNumber,IsString } from 'class-validator';

export class getUserDto {

    @IsNotEmpty()
    id: string;
  
    @IsNotEmpty()
    azure_user_id: string;

    @IsNotEmpty()
    @IsString()
    first_name: string;
  
    @IsNotEmpty()
    @IsString()
    last_name: string;

    @IsString()
    organization: string;
  
    @IsString()
    designation: string;

    @IsString()
    country: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    // @IsNotEmpty()
    // @IsString()
    // password: string;

    @IsDate()
    created_at: Date;
    
    @IsDate()
    updated_at: Date;

    @IsNumber()
    is_active: number;

    @IsNumber()
    is_delete: number;

    constructor(data: { id: string;azure_user_id: string;first_name: string;last_name: string;organization: string; designation: string; country: string; email: string; created_at:Date; updated_at:Date; is_active:number; is_delete:number}) {    
   
      this.id = data.id || "";
      this.azure_user_id = data.azure_user_id || "";
      this.first_name = data.first_name || "";
      this.last_name = data.last_name || "";
      this.organization = data.organization || "";
      this.designation = data.designation || "";
      this.country = data.country || "";
      this.email = data.email ||  "";
      // this.password = data.password ||  "";
  
      this.created_at = data.created_at;
      this.updated_at = data.updated_at;
      this.is_active = data.is_active;
      this.is_delete = data.is_delete;
    }

  }