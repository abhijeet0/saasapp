import { InternalServerErrorException, Scope } from '@nestjs/common';
import { Connection } from 'mongoose';
import { UsersRolesGroupsMappings, UsersRolesGroupsMappingsSchema } from './users-roles-groups-mappings.model';

export const userRoleGroupMppingTenantModels = {
  userroleGroupModel: {
    provide: UsersRolesGroupsMappings.name,
    useFactory: async (tenantConnection: Connection) => {
      return tenantConnection.model(UsersRolesGroupsMappings.name, UsersRolesGroupsMappingsSchema);
    },
    inject: ['TENANT_CONNECTION'],
  },
};