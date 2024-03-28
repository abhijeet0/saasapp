import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { RequestForDemoModule } from './request-for-demo/request-for-demo.module';
import { RolesModule } from './roles/roles.module';
import { GroupsModule } from './groups/groups.module';
import { UsersModule } from './users/users.module';
import { UsersRolesGroupsMappingsModule } from './users-roles-groups-mappings/users-roles-groups-mappings.module';
import { EventsModule } from './events/events.module';
// import { AuthModule } from './auth/auth-module';
import { TenantsModule } from './tenants/tenant.module';
import config from './config/config';
import { RolesMiddleware } from './roles/roles.middleware';
import { RolesService } from './roles/roles.service';
import { Roles, RolesSchema } from './roles/roles.model';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [config],
    }),
    // ConfigModule.forRoot(),
    // MongooseModule.forRoot(process.env.MONGODB_URL, {}),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config) => ({
        uri: config.get('database.connectionString'),
      }),
      inject: [ConfigService],
    }),
    RequestForDemoModule,
    RolesModule,
    GroupsModule,
    UsersModule,
    UsersRolesGroupsMappingsModule,
    EventsModule,
    TenantsModule
    // AuthModule
  ],
  controllers: [],
  providers: [],
  exports:[]
})

export class AppModule {

}
// export class AppModule implements NestModule {
//   configure(consumer: MiddlewareConsumer) {
//     consumer.apply(RolesMiddleware).forRoutes('/v1/users');
//   }
// }