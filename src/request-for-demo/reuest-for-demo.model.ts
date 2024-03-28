import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsEmail } from 'class-validator';
import { Document } from 'mongoose';

@Schema()
export class RequestForDemo extends Document {

  @Prop()
  first_name: string;

  @Prop()
  last_name: string;

  @Prop()
  email: string;

  @Prop()
  status: string;

  @Prop()
  mobile: string;

  @Prop()
  created_at: Date;

  @Prop()  
  updated_at: Date;

  @Prop()
  is_active: number;

  @Prop()
  is_delete: number;

}

export const RequestForDemoSchema = SchemaFactory.createForClass(RequestForDemo);
