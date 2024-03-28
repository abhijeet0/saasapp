import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Events extends Document {
  
    @Prop()
    summary: string;

    @Prop()
    start_date: Date;

    @Prop()
    end_Date: Date;

    @Prop()
    type: string;

    @Prop({type:Object})
    event_details: Object;

    @Prop()
    created_at: Date;
  
    @Prop()
    updated_at: Date;
  
    @Prop()
    is_active: number;
  
    @Prop()
    is_delete: number;
}

export const EventsSchema = SchemaFactory.createForClass(Events);
