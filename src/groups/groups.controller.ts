import { Controller, Get, Post, Body, Param, Put, Delete, Query, HttpException } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { CustomMessages } from '../utils/custom-messages';
import { StatusCodes } from '../utils/status-codes';
import { Response } from '../utils/response';
import { ApiTags,ApiOperation, ApiHeader, ApiBearerAuth } from '@nestjs/swagger';
import { UpdateGroupsDto } from './groups-dtos/update-groups-dto';
import { CreateGroupsDto } from './groups-dtos/create-groups-dto';
import { GetAllGroupsDto } from './groups-dtos/get-all-groups-dto';
import { getGroupsDto } from './groups-dtos/get-groups-dto';

@ApiTags('groups')
@Controller('v1/groups')
export class GroupsController {
  public page;
  public size;

  constructor(private readonly groupsService: GroupsService) {
    this.page = 0;
    this.size = 10;
  }

  @ApiOperation({ summary: 'create new group'})
  @Post()
  @ApiHeader({name:"x-tenant-id"})
  @ApiBearerAuth()
  async create(@Body() payload: CreateGroupsDto){
    try {
      const response = await this.groupsService.create(payload);
      if (response['isSuccess']) {
       
        const groupData = new getGroupsDto(response['result']);  
        response['result'] = groupData;      
      } 

      return response;
    } catch(err) {
throw new HttpException({status: StatusCodes.INTERNAL_SERVER_ERROR,error: CustomMessages.INTERNAL_SERVER_ERROR,message: err}, 
                StatusCodes.INTERNAL_SERVER_ERROR, {cause: err});    }
  }

  @ApiOperation({ summary: 'get all group' })
  @Get()
  @ApiHeader({name:"x-tenant-id"})
  @ApiBearerAuth()
  async findAll(@Query() query:GetAllGroupsDto) {

    try {  
      let size = query['size'] ? query['size'] : this.size;
      let page = query['page'] ? query['page'] : this.page;
      let filters;
      if (query['filters']) {
        filters = JSON.parse(query['filters'])   
      }
      let condition = {};
      condition = {...filters};
      const response = await this.groupsService.findAll(condition,size,page);
      let groupsData = response['result'].map(data=>new getGroupsDto(data));
      response['result'] = groupsData;
      return response;
    } catch(err) {
        throw new HttpException({status: StatusCodes.INTERNAL_SERVER_ERROR,error: CustomMessages.INTERNAL_SERVER_ERROR,message: err}, 
                StatusCodes.INTERNAL_SERVER_ERROR, {cause: err});    }
  }

  @ApiOperation({ summary: 'get group by id' })
  @Get(':id')
  @ApiHeader({name:"x-tenant-id"})
  @ApiBearerAuth()
  async findOne(@Param('id') id: string) {

    try {
      const response = await this.groupsService.findOne({_id:id});
      if (response['isSuccess']) {
       
        const groupData = new getGroupsDto(response['result']);  
        response['result'] = groupData;      
      } 
      return response;
    } catch(err) {
        throw new HttpException({status: StatusCodes.INTERNAL_SERVER_ERROR,error: CustomMessages.INTERNAL_SERVER_ERROR,message: err}, 
                StatusCodes.INTERNAL_SERVER_ERROR, {cause: err});
    }
  }

  @ApiOperation({ summary: 'update group by id'})
  @Put(':id')
  @ApiHeader({name:"x-tenant-id"})
  @ApiBearerAuth()
  async update(@Param('id') id: string, @Body() payload: UpdateGroupsDto) {

    try {
      const response = await this.groupsService.update(id, payload);
      if (response['isSuccess']) {
       
        const groupData = new getGroupsDto(response['result']);  
        response['result'] = groupData;      
      } 

      return response;
    } catch(err) {
        throw new HttpException({status: StatusCodes.INTERNAL_SERVER_ERROR,error: CustomMessages.INTERNAL_SERVER_ERROR,message: err}, 
                StatusCodes.INTERNAL_SERVER_ERROR, {cause: err});    }
  }

  @Delete(':id')
  @ApiHeader({name:"x-tenant-id"})
  @ApiBearerAuth()
  remove(@Param('id') id: string) {

    try {
      return this.groupsService.delete(id);
    } catch(err) {
        throw new HttpException({status: StatusCodes.INTERNAL_SERVER_ERROR,error: CustomMessages.INTERNAL_SERVER_ERROR,message: err}, 
                StatusCodes.INTERNAL_SERVER_ERROR, {cause: err});    }
  }
}
