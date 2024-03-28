import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsDate, IsNotEmpty,IsNumber,IsString } from 'class-validator';

export class getRolesDto {

    @IsNotEmpty()
    id: string;
  
    @IsNotEmpty()
    @IsString()
    name: string;
  
    @IsNotEmpty()
    permissions: Object;

    @IsDate()
    created_at: Date;
    
    @IsDate()
    updated_at: Date;

    @IsNumber()
    is_active: number;

    @IsNumber()
    is_delete: number;

    constructor(data: { id: string;name: string;permissions: Object; created_at:Date; updated_at:Date; is_active:number; is_delete:number}) {    
   
      this.id = data && data.id !== undefined ? data.id : "";
      this.name = data.name || "";
      this.permissions = data.permissions || {};
 
      this.created_at = data.created_at;
      this.updated_at = data.updated_at;
      this.is_active = data.is_active;
      this.is_delete = data.is_delete;
    }

  }

  