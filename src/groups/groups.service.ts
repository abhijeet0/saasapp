import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CommonCrudService } from '../common-crud/common-crud-service';
import { Groups,GroupsSchema } from './groups.model';

@Injectable()
export class GroupsService extends CommonCrudService<Groups> {
  constructor(@Inject(Groups.name) private readonly groupsModel: Model<Groups>) {
    super(groupsModel);
  }
}
