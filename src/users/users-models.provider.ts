import { InternalServerErrorException, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { getConnectionToken } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { Users, UsersSchema } from './users.model';

export const UserTenantModels = {
  userModel: {
    provide: Users.name,
    useFactory: async (tenantConnection: Connection) => {
      return tenantConnection.model(Users.name, UsersSchema);
    },
    inject: ['TENANT_CONNECTION'],
  },
};