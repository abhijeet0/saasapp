import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsDate, IsNotEmpty,IsNumber,IsString } from 'class-validator';

export class getTenantsDto {

    @IsNotEmpty()
    id: string;
  
    @IsNotEmpty()
    @IsString()
    company_name: string;
  
    @IsNotEmpty()
    @IsString()
    tenant_id: string;

    @IsDate()
    created_at: Date;
    
    @IsDate()
    updated_at: Date;

    @IsNumber()
    is_active: number;

    @IsNumber()
    is_delete: number;

    constructor(data: { id: string;company_name: string;tenant_id: string; created_at:Date; updated_at:Date; is_active:number; is_delete:number}) {    
   
      this.id = data && data.id !== undefined ? data.id : "";
      this.company_name = data.company_name || "";
      this.tenant_id = data.tenant_id || "";
 
      this.created_at = data.created_at;
      this.updated_at = data.updated_at;
      this.is_active = data.is_active;
      this.is_delete = data.is_delete;
    }

  }

  