import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { TenantsMiddleware } from 'src/middlewares/tenant.middleware';
import { tenantConnectionProvider } from 'src/providers/tenant-connection.provider';
import { tenantModels } from './roles-models.provider';
import { RolesMiddleware } from './roles.middleware';
import { UsersRolesGroupsMappings } from 'src/users-roles-groups-mappings/users-roles-groups-mappings.model';
import { UsersRolesGroupsMappingsModule } from 'src/users-roles-groups-mappings/users-roles-groups-mappings.module';
import { GroupsModule } from 'src/groups/groups.module';

@Module({
  imports:[UsersRolesGroupsMappingsModule,GroupsModule],
  controllers: [RolesController],
  providers: [
    RolesService,
    tenantModels.roleModel
  ],
  exports:[RolesService]
})
export class RolesModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantsMiddleware).forRoutes(RolesController);
  }
}