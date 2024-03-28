import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { type } from 'os';

@Schema()
export class Groups extends Document {
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

export const GroupsSchema = SchemaFactory.createForClass(Groups);
