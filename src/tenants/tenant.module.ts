import { Global, Module } from '@nestjs/common';
import { TenantsService } from './tenant.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Tenant, TenantSchema } from './tenant.model';
import { tenantConnectionProvider } from 'src/providers/tenant-connection.provider';
import { TenantsController } from './tenant.controller';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Tenant.name,
        schema: TenantSchema,
      },
    ]),
  ],
  controllers: [TenantsController],
  providers: [TenantsService, tenantConnectionProvider,TenantsController],
  exports: [TenantsService, tenantConnectionProvider,TenantsController],
})
export class TenantsModule {}