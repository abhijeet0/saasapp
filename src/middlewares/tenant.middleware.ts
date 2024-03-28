import {
    Injectable,
    NestMiddleware,
    BadRequestException,
    NotFoundException,
  } from '@nestjs/common';
  import { Request, Response, NextFunction } from 'express';
  import { TenantsService } from 'src/tenants/tenant.service';
  
  @Injectable()
  export class TenantsMiddleware implements NestMiddleware {
    constructor(private tenantsService: TenantsService) {}
  
    async use(req: Request, res: Response, next: NextFunction) {
      const tenantId = req.headers['x-tenant-id']?.toString();
      if (!tenantId) {
        throw new BadRequestException('X-TENANT-ID not provided');
      }
  
      console.log("this is log to test");
      
      const response = await this.tenantsService.findOne({tenant_id:tenantId});
      console.log("tenantExits",response);
      
      if (!response['isSuccess']) {
        throw new NotFoundException('Tenant does not exist');
      }
      req['tenantId'] = tenantId;
      next();
    }
  }