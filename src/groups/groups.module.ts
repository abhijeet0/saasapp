import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GroupsController } from './groups.controller';
import { GroupsService } from './groups.service';
import { Groups, GroupsSchema } from '../groups/groups.model';
import { TenantsMiddleware } from 'src/middlewares/tenant.middleware';
import { TenantsController } from 'src/tenants/tenant.controller';
import { groupsTenantModels } from './groups-models.provider';

@Module({
  // imports: [MongooseModule.forFeature([{ name: Groups.name, schema: GroupsSchema }])],
  controllers: [GroupsController],
  providers: [GroupsService,TenantsController,groupsTenantModels.groupsModel],
  exports: [GroupsService],
})
export class GroupsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantsMiddleware).forRoutes(GroupsController);
  }
}
