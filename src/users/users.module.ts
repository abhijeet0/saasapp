import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { Users, UsersSchema } from './users.model';
import { TenantsController } from 'src/tenants/tenant.controller';
import { TenantsModule } from 'src/tenants/tenant.module';
import { TenantsMiddleware } from 'src/middlewares/tenant.middleware';
import { UserTenantModels } from './users-models.provider';
import { RolesMiddleware } from 'src/roles/roles.middleware';
import { RolesService } from 'src/roles/roles.service';
import { RolesModule } from 'src/roles/roles.module';
import { UsersRolesGroupsMappingsService } from 'src/users-roles-groups-mappings/users-roles-groups-mappings.service';
import { UsersRolesGroupsMappingsModule } from 'src/users-roles-groups-mappings/users-roles-groups-mappings.module';
import { GroupsModule } from 'src/groups/groups.module';
import { RolesController } from 'src/roles/roles.controller';
import { EmailService } from 'src/email-send/email-send.service';

@Module({
  // imports: [MongooseModule.forFeature([{ name: Users.name, schema: UsersSchema }])],
  imports:[RolesModule,UsersRolesGroupsMappingsModule,GroupsModule],
  controllers: [UsersController],
  providers: [UsersService,TenantsController,UserTenantModels.userModel,RolesController,EmailService],
  exports: [UsersService],
})
export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantsMiddleware,RolesMiddleware).forRoutes(UsersController);
  }
}