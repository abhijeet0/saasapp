// import { Injectable } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Tenant } from './tenant.schema';
// import { Model } from 'mongoose';

// @Injectable()
// export class TenantsService {
//   constructor(
//     @InjectModel(Tenant.name)
//     private TenantModel: Model<Tenant>,
//   ) {}

//   async getTenantById(tenantId: string) {
//     return this.TenantModel.findOne({ tenantId });
//   }
// }
import { Injectable,Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CommonCrudService } from '../common-crud/common-crud-service';
import { Tenant,TenantSchema } from './tenant.model';

@Injectable()
export class TenantsService extends CommonCrudService<Tenant> {
  constructor(@InjectModel(Tenant.name) private readonly tenantModel: Model<Tenant>) {
    super(tenantModel);
  }
}
