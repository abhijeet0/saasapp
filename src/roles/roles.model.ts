import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsDate } from 'class-validator';
import { Document } from 'mongoose';

@Schema()
export class Roles extends Document {
  @Prop()
  name: string;

  @Prop({type:Object})
  permissions: Object;

  @Prop()
  created_at: Date;

  @Prop()
  updated_at: Date;

  @Prop()
  is_active: number;

  @Prop()
  is_delete: number;
}

export const RolesSchema = SchemaFactory.createForClass(Roles);
