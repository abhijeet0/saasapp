import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CommonCrudService } from '../common-crud/common-crud-service';
import { UsersRolesGroupsMappings } from './users-roles-groups-mappings.model';

@Injectable()
export class UsersRolesGroupsMappingsService extends CommonCrudService<UsersRolesGroupsMappings> {
  constructor(@Inject(UsersRolesGroupsMappings.name) private readonly userRolesGroupsmappingsModel: Model<UsersRolesGroupsMappings>) {
    super(userRolesGroupsmappingsModel);
  }
}
