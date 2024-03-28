import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Users extends Document {

  @Prop()
  first_name: string;

  @Prop()
  last_name: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop()
  azure_user_id: string;

  @Prop()
  created_at: Date;

  @Prop()
  updated_at: Date;

  @Prop()
  is_active: number;

  @Prop()
  is_delete: number;
}

export const UsersSchema = SchemaFactory.createForClass(Users);
