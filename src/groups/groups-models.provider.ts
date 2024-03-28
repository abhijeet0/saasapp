import { InternalServerErrorException, Scope } from '@nestjs/common';
import { Connection } from 'mongoose';
import { Groups, GroupsSchema } from './groups.model';

export const groupsTenantModels = {
  groupsModel: {
    provide: Groups.name,
    useFactory: async (tenantConnection: Connection) => {
      return tenantConnection.model(Groups.name, GroupsSchema);
    },
    inject: ['TENANT_CONNECTION'],
  },
};