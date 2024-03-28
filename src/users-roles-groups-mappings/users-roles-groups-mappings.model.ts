import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class UsersRolesGroupsMappings extends Document {
  @Prop()
  user_id: string;

  @Prop()
  role_id: string;

  @Prop()
  group_id: string;

  @Prop()
  created_at: Date;

  @Prop()
  updated_at: Date;

  @Prop()
  is_active: number;

  @Prop()
  is_delete: number;
}

export const UsersRolesGroupsMappingsSchema = SchemaFactory.createForClass(UsersRolesGroupsMappings);
