import { Module } from '@nestjs/common';
import { RequestForDemoService } from './request-for-demo.service';
import { RequestForDemoController } from './request-for-demo.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { RequestForDemo, RequestForDemoSchema } from './reuest-for-demo.model';
import { EventsModule } from 'src/events/events.module';

@Module({
  imports: [
  MongooseModule.forFeature([{ name: RequestForDemo.name, schema: RequestForDemoSchema }]),
  EventsModule  ],
  providers: [RequestForDemoService],
  controllers: [RequestForDemoController],
  exports:[RequestForDemoService]
})
export class RequestForDemoModule {}
