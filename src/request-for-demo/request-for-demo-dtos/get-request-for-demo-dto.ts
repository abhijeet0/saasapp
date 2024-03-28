import { Date, isValidObjectId } from "mongoose";
import { IsDate, IsEmail, IsNotEmpty,IsNumber,IsObject,IsOptional,IsString,Matches } from 'class-validator';

export class GetRequestForDemoDto {

    @IsString()
    id: string;

    @IsEmail()
    email: string;

    @IsString()
    first_name: string;

    @IsString()
    last_name: string;

    @IsString()
    status: string;

    @IsString()
    mobile: string;

    @IsObject()
    event_details: Object;

    @IsString()
    created_at: string;
    
    @IsString()
    updated_at: string;

    @IsNumber()
    is_active: number;

    @IsNumber()
    is_delete: number;


  constructor(data: { id: string,first_name: string,last_name: string, email: string, status:string; mobile:string, event_details:Object, created_at:string, updated_at:string, is_active:number, is_delete:number}) {    
   
    this.id = data.id || "";
    this.first_name = data.first_name || "";
    this.last_name = data.last_name || "";
    this.email = data.email ||  "";
    this.status = data.status ||  "";
    this.mobile = data.mobile ||  "";
    this.event_details = data.event_details ||  {};



    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
    this.is_active = data.is_active;
    this.is_delete = data.is_delete;
  }

  }