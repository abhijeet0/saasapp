import { InternalServerErrorException, Scope } from '@nestjs/common';
import { Connection } from 'mongoose';
import { Roles, RolesSchema } from './roles.model';

export const tenantModels = {
  roleModel: {
    provide: Roles.name,
    useFactory: async (tenantConnection: Connection) => {
      return tenantConnection.model(Roles.name, RolesSchema);
    },
    inject: ['TENANT_CONNECTION'],
  },
};