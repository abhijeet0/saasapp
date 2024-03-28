import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CommonCrudService } from '../common-crud/common-crud-service';
import { RequestForDemo,RequestForDemoSchema } from './reuest-for-demo.model';
import { Model } from 'mongoose';

@Injectable()
export class RequestForDemoService extends CommonCrudService<RequestForDemo> {
    constructor(@InjectModel(RequestForDemo.name) private readonly requestForDemoModel: Model<RequestForDemo>) {
    super(requestForDemoModel);
    }
}
