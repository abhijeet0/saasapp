import { Controller, Get, Post, Body, Param, Put, Delete, Query, HttpException, Inject } from '@nestjs/common';
import { UsersRolesGroupsMappingsService} from './users-roles-groups-mappings.service';
import { CustomMessages } from '../utils/custom-messages';
import { StatusCodes } from '../utils/status-codes';
import { Response } from '../utils/response';
import { ApiTags,ApiOperation, ApiHeader, ApiBearerAuth } from '@nestjs/swagger';
import { UpdateUsersRolesGroupsMappingDto } from './users-roles-groups-mappings-dtos/update-users-roles-groups-mappings-dto';
import { CreateUsersRolesGroupsMappingDto } from './users-roles-groups-mappings-dtos/create-users-roles-groups-mappings-dto';
import { GetAllUsersRolesGroupsMappingsDto } from './users-roles-groups-mappings-dtos/get-all-users-roles-groups-mappings-dto';
import { getUsersRolesGroupsMappingDto } from './users-roles-groups-mappings-dtos/get-users-roles-groups-mappings-dto';
import { RolesService } from 'src/roles/roles.service';

@ApiTags('users-roles-groups-mappings')
@Controller('v1/users-roles-groups-mappings')
export class UsersRolesGroupsMappingsController {
  public page;
  public size;

  constructor(private readonly usersRolesGroupsMappingsService: UsersRolesGroupsMappingsService) {
    this.page = 0;
    this.size = 10;
  }

  @ApiOperation({ summary: 'create new User Role Grup Map'})
  @Post()
  @ApiHeader({name:"x-tenant-id"})
  @ApiBearerAuth()
  async create(@Body() payload: CreateUsersRolesGroupsMappingDto){
    try {
      const response = await this.usersRolesGroupsMappingsService.create(payload);
      if (response['isSuccess']) {
       
        const userRoleGrupMapData = new getUsersRolesGroupsMappingDto(response['result']);      
        response['result'] = userRoleGrupMapData;
      } 
      return response;
    } catch(err) {
        throw new HttpException({status: StatusCodes.INTERNAL_SERVER_ERROR,error: CustomMessages.INTERNAL_SERVER_ERROR,message: err}, 
                StatusCodes.INTERNAL_SERVER_ERROR, {cause: err});    }
  }

  @ApiOperation({ summary: 'get all User Role Grup Map' })
  @Get()
  @ApiHeader({name:"x-tenant-id"})
  @ApiBearerAuth()
  async findAll(@Query() query:GetAllUsersRolesGroupsMappingsDto) {

    try {  
      let size = query['size'] ? query['size'] : this.size;
      let page = query['page'] ? query['page'] : this.page;
      let filters;
      if (query['filters']) {
        filters = JSON.parse(query['filters'])   
      }
      let condition = {};
      condition = {...filters};
      const response = await this.usersRolesGroupsMappingsService.findAll(condition,size,page);
      let mappedData = response['result'].map(data=>new getUsersRolesGroupsMappingDto(data));
      return response['result'] = mappedData;
    } catch(err) {
        throw new HttpException({status: StatusCodes.INTERNAL_SERVER_ERROR,error: CustomMessages.INTERNAL_SERVER_ERROR,message: err}, 
                StatusCodes.INTERNAL_SERVER_ERROR, {cause: err});    }
  }

  @ApiOperation({ summary: 'get user role group map by id' })
  @Get(':id')
  @ApiHeader({name:"x-tenant-id"})
  @ApiBearerAuth()
  async findOne(@Param('id') id: string) {

    try {
      const response = await this.usersRolesGroupsMappingsService.findOne({_id:id});
      if (response['isSuccess']) {
       
        const userRoleGrupMapData = new getUsersRolesGroupsMappingDto(response['result']);      
        response['result'] = userRoleGrupMapData;
      } 
      return response;
    } catch(err) {
        throw new HttpException({status: StatusCodes.INTERNAL_SERVER_ERROR,error: CustomMessages.INTERNAL_SERVER_ERROR,message: err}, 
                StatusCodes.INTERNAL_SERVER_ERROR, {cause: err});
    }
  }

  @ApiOperation({ summary: 'update User Role Grup Map by id'})
  @Put(':id')
  @ApiHeader({name:"x-tenant-id"})
  @ApiBearerAuth()
  async update(@Param('id') id: string, @Body() payload: UpdateUsersRolesGroupsMappingDto) {

    try {
      const response = await this.usersRolesGroupsMappingsService.update(id, payload);
      if (response['isSuccess']) {
       
        const userRoleGrupMapData = new getUsersRolesGroupsMappingDto(response['result']);      
        response['result'] = userRoleGrupMapData;
      } 
      return response;
    } catch(err) {
        throw new HttpException({status: StatusCodes.INTERNAL_SERVER_ERROR,error: CustomMessages.INTERNAL_SERVER_ERROR,message: err}, 
                StatusCodes.INTERNAL_SERVER_ERROR, {cause: err});    }
  }

  @ApiOperation({ summary: 'delete User Role Grup Map by id'})
  @Delete(':id')
  @ApiHeader({name:"x-tenant-id"})
  @ApiBearerAuth()
  remove(@Param('id') id: string) {

    try {
      return this.usersRolesGroupsMappingsService.delete(id);
    } catch(err) {
        throw new HttpException({status: StatusCodes.INTERNAL_SERVER_ERROR,error: CustomMessages.INTERNAL_SERVER_ERROR,message: err}, 
                StatusCodes.INTERNAL_SERVER_ERROR, {cause: err});    }
  }
}
