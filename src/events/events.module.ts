import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { Events, EventsSchema } from '../events/events.model';
import { EmailService } from 'src/email-send/email-send.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Events.name, schema: EventsSchema }])],
  controllers: [EventsController],
  providers: [EventsService,EventsController,EmailService],
  exports: [EventsService,EventsController],
})
export class EventsModule {}
