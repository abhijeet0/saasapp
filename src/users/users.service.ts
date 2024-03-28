import { Injectable,Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CommonCrudService } from '../common-crud/common-crud-service';
import { Users } from './users.model';

@Injectable()
export class UsersService extends CommonCrudService<Users> {
  constructor(@Inject(Users.name) private readonly usersModel: Model<Users>) {
    super(usersModel);
  }
}
