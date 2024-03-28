import { IsArray, IsDate, IsNotEmpty,IsNumber,IsString } from 'class-validator';

export class getUsersRolesGroupsMappingDto {

    @IsNotEmpty()
    id: string;
  
    @IsNotEmpty()
    @IsString()
    user_id: string;
  
    @IsNotEmpty()
    @IsString()
    role_id: string;

    @IsString()
    group_id: string;

    @IsDate()
    created_at: Date;
    
    @IsDate()
    updated_at: Date;

    @IsNumber()
    is_active: number;

    @IsNumber()
    is_delete: number;

    constructor(data: { id: string;user_id: string;role_id: string; created_at:Date; updated_at:Date; is_active:number; is_delete:number}) {    
   
      this.id = data && data.id !== undefined ? data.id : "";
      this.user_id = data.user_id || "";
      this.role_id = data.role_id || "";
 
      this.created_at = data.created_at;
      this.updated_at = data.updated_at;
      this.is_active = data.is_active;
      this.is_delete = data.is_delete;
    }

  }

  