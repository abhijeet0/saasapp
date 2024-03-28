import { Controller, Get, Post, Body, Param, Put, Delete, Query, HttpException } from '@nestjs/common';
import { TenantsService } from './tenant.service';
import { CustomMessages } from '../utils/custom-messages';
import { StatusCodes } from '../utils/status-codes';
import { Response } from '../utils/response';
import { ApiTags,ApiOperation } from '@nestjs/swagger';
import { UpdateTenantDto } from './tenants-dtos/update-tenants-dto';
import { CreateTenantDto } from './tenants-dtos/create-tenant-dto';
import { GetAllTenantsDto } from './tenants-dtos/get-all-tenants-dto';
import { getTenantsDto } from './tenants-dtos/get-tenants-dto';
import { log } from 'console';

@ApiTags('tenants')
@Controller('v1/tenants')
export class TenantsController {
  public page;
  public size;

  constructor(private readonly tenantsService: TenantsService) {
    this.page = 0;
    this.size = 10;
  }

  @ApiOperation({ summary: 'create new tenant'})
  @Post()
  async create(@Body() tenant: CreateTenantDto){
    try {        
      tenant['tenant_id'] = tenant['company_name'];
      const response = await this.tenantsService.create(tenant);
      if (response['isSuccess']) {
        const tenantData = new getTenantsDto(response['result']);  
        response['result'] = tenantData;   
      } 
      return response;
    } catch(err) {        
        throw new HttpException({status: StatusCodes.INTERNAL_SERVER_ERROR,error: CustomMessages.INTERNAL_SERVER_ERROR,message: err}, 
                StatusCodes.INTERNAL_SERVER_ERROR, {cause: err});    }
  }

  @ApiOperation({ summary: 'get all tenant' })
  @Get()
  async findAll(@Query() query:GetAllTenantsDto) {

    try {  
      let size = query['size'] ? query['size'] : this.size;
      let page = query['page'] ? query['page'] : this.page;
      let filters;
      if (query['filters']) {
        filters = JSON.parse(query['filters'])   
      }
      let condition = {};
      condition = {...filters};
      const response = await this.tenantsService.findAll(condition,size,page);
      let tenantsData = response['result'].map(data=>new getTenantsDto(data));
      response['result'] = tenantsData;
      return response;
    } catch(err) {
        throw new HttpException({status: StatusCodes.INTERNAL_SERVER_ERROR,error: CustomMessages.INTERNAL_SERVER_ERROR,message: err}, 
                StatusCodes.INTERNAL_SERVER_ERROR, {cause: err});    }
  }

  @ApiOperation({ summary: 'get tenant by id' })
  @Get(':id')
  async findOne(@Param('id') id: string) {

    try {
      const response = await this.tenantsService.findOne({_id:id});
      if (response['isSuccess']) {
       
        const tenantData = new getTenantsDto(response['result']);  
        response['result'] = tenantData;  
      }    
      return response;
    } catch(err) {
        throw new HttpException({status: StatusCodes.INTERNAL_SERVER_ERROR,error: CustomMessages.INTERNAL_SERVER_ERROR,message: err}, 
                StatusCodes.INTERNAL_SERVER_ERROR, {cause: err});
    }
  }

  @ApiOperation({ summary: 'update tenant by id'})
  @Put(':id')
  async update(@Param('id') id: string, @Body() role: UpdateTenantDto) {

    try {
      const response = await this.tenantsService.update(id, role);
      if (response['isSuccess']) {
       
        const tenantData = new getTenantsDto(response['result']);  
        response['result'] = tenantData;
      } 
      
      return response;
    } catch(err) {
        throw new HttpException({status: StatusCodes.INTERNAL_SERVER_ERROR,error: CustomMessages.INTERNAL_SERVER_ERROR,message: err}, 
                StatusCodes.INTERNAL_SERVER_ERROR, {cause: err});    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {

    try {
      return await this.tenantsService.delete(id);
    } catch(err) {
        throw new HttpException({status: StatusCodes.INTERNAL_SERVER_ERROR,error: CustomMessages.INTERNAL_SERVER_ERROR,message: err}, 
                StatusCodes.INTERNAL_SERVER_ERROR, {cause: err});    }
  }
}
