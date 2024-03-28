import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CommonCrudService } from '../common-crud/common-crud-service';
import { Events,EventsSchema } from './events.model';

@Injectable()
export class EventsService extends CommonCrudService<Events> {
  constructor(@InjectModel(Events.name) private readonly eventsModel: Model<Events>) {
    super(eventsModel);
  }
}
