import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
@Schema()
export class Tenant extends Document {
 
  @Prop({ required: true })
  company_name: string;

  @Prop({ required: true, unique: true })
  tenant_id: string;

  @Prop()
  created_at: Date;

  @Prop()
  updated_at: Date;

  @Prop()
  is_active: number;

  @Prop()
  is_delete: number;
}

export const TenantSchema = SchemaFactory.createForClass(Tenant);
