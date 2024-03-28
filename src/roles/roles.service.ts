import { Injectable,Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CommonCrudService } from '../common-crud/common-crud-service';
import { Roles,RolesSchema } from './roles.model';

@Injectable()
export class RolesService extends CommonCrudService<Roles> {
  constructor(@Inject(Roles.name) private readonly rolesModel: Model<Roles>) {
    super(rolesModel);
  }
}
