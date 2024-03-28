import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersRolesGroupsMappingsController } from './users-roles-groups-mappings.controller';
import { UsersRolesGroupsMappingsService } from './users-roles-groups-mappings.service';
import { UsersRolesGroupsMappings,UsersRolesGroupsMappingsSchema } from './users-roles-groups-mappings.model';
import { TenantsMiddleware } from 'src/middlewares/tenant.middleware';
import { TenantsController } from 'src/tenants/tenant.controller';
import { userRoleGroupMppingTenantModels } from './user-roles-groups-mapping-models.provider';
import { RolesService } from 'src/roles/roles.service';
import { RolesModule } from 'src/roles/roles.module';
@Module({
  // imports: [MongooseModule.forFeature([{ name: UsersRolesGroupsMappings.name, schema: UsersRolesGroupsMappingsSchema }])],
  imports:[],
  controllers: [UsersRolesGroupsMappingsController],
  providers: [UsersRolesGroupsMappingsService,TenantsController,userRoleGroupMppingTenantModels.userroleGroupModel],
  exports: [UsersRolesGroupsMappingsService],
})
export class UsersRolesGroupsMappingsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantsMiddleware).forRoutes(UsersRolesGroupsMappingsController);
  }
}