import { Controller, Get, Post, Body, Param, Put, Delete, Query, HttpException, Inject } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CustomMessages } from '../utils/custom-messages';
import { StatusCodes } from '../utils/status-codes';
import { Response } from '../utils/response';
import { ApiTags, ApiOperation, ApiHeader, ApiBearerAuth } from '@nestjs/swagger';
import { UpdateRoleDto } from './roles-dtos/update-roles-dto';
import { CreateRolesDto } from './roles-dtos/create-roles-dto';
import { GetAllRolesDto } from './roles-dtos/get-all-roles-dto';
import { getRolesDto } from './roles-dtos/get-roles-dto';
import { UsersRolesGroupsMappingsService } from 'src/users-roles-groups-mappings/users-roles-groups-mappings.service';
import { GroupsService } from 'src/groups/groups.service';

@ApiTags('roles')
@Controller('v1/roles')
export class RolesController {
  public page;
  public size;

  constructor(private readonly rolesService: RolesService, @Inject(UsersRolesGroupsMappingsService) private readonly usersRolesGroupsMappingsService, @Inject(GroupsService) private readonly groupsService: GroupsService) {
    this.page = 0;
    this.size = 10;
  }

  @ApiOperation({ summary: 'create new role' })
  @Post()
  @ApiHeader({name:"x-tenant-id"})
  @ApiBearerAuth()
  async create(@Body() role: CreateRolesDto) {
    try {
      const response = await this.rolesService.create(role);
      if (response['isSuccess']) {
        const roleData = new getRolesDto(response['result']);
        response['result'] = roleData;
      }
      return response;
    } catch (err) {
      throw new HttpException({ status: StatusCodes.INTERNAL_SERVER_ERROR, error: CustomMessages.INTERNAL_SERVER_ERROR, message: err },
        StatusCodes.INTERNAL_SERVER_ERROR, { cause: err });
    }
  }

  @ApiOperation({ summary: 'get all roles' })
  @Get()
  @ApiHeader({name:"x-tenant-id"})
  @ApiBearerAuth()
  async findAll(@Query() query: GetAllRolesDto) {

    try {
      let size = query['size'] ? query['size'] : this.size;
      let page = query['page'] ? query['page'] : this.page;
      let filters;
      if (query['filters']) {
        filters = JSON.parse(query['filters'])
      }
      let condition = {};
      condition = { ...filters };
      const response = await this.rolesService.findAll(condition, size, page);
      let rolesData = response['result'].map(data => new getRolesDto(data));
      response['result'] = rolesData;
      return response;
    } catch (err) {
      throw new HttpException({ status: StatusCodes.INTERNAL_SERVER_ERROR, error: CustomMessages.INTERNAL_SERVER_ERROR, message: err },
        StatusCodes.INTERNAL_SERVER_ERROR, { cause: err });
    }
  }

  @ApiOperation({ summary: 'get role by id' })
  @Get(':id')
  @ApiHeader({name:"x-tenant-id"})
  @ApiBearerAuth()
  async findOne(@Param('id') id: string) {

    try {
      const response = await this.rolesService.findOne({ _id: id });
      if (response['isSuccess']) {

        const roleData = new getRolesDto(response['result']);
        response['result'] = roleData;
      }
      return response;
    } catch (err) {
      throw new HttpException({ status: StatusCodes.INTERNAL_SERVER_ERROR, error: CustomMessages.INTERNAL_SERVER_ERROR, message: err },
        StatusCodes.INTERNAL_SERVER_ERROR, { cause: err });
    }
  }

  @ApiOperation({ summary: 'update role by id' })
  @Put(':id')
  @ApiHeader({name:"x-tenant-id"})
  @ApiBearerAuth()
  async update(@Param('id') id: string, @Body() role: UpdateRoleDto) {
    try {
      const response = await this.rolesService.update(id, role);
      if (response['isSuccess']) {

        const roleData = new getRolesDto(response['result']);
        response['result'] = roleData;
      }

      return response;
    } catch (err) {
      throw new HttpException({ status: StatusCodes.INTERNAL_SERVER_ERROR, error: CustomMessages.INTERNAL_SERVER_ERROR, message: err },
        StatusCodes.INTERNAL_SERVER_ERROR, { cause: err });
    }
  }

  @Delete(':id')
  @ApiHeader({name:"x-tenant-id"})
  @ApiBearerAuth()
  async remove(@Param('id') id: string) {
    try {
      return await this.rolesService.delete(id);
    } catch (err) {
      throw new HttpException({ status: StatusCodes.INTERNAL_SERVER_ERROR, error: CustomMessages.INTERNAL_SERVER_ERROR, message: err },
        StatusCodes.INTERNAL_SERVER_ERROR, { cause: err });
    }
  }

  async generateName(permissionObj) {
    let newArr = [];
    let keys = Object.keys(permissionObj);
    keys.forEach((key) => {
      permissionObj[key].forEach((permission) => {
        if (permission == "POST") {
          newArr.push("create_" + key)
        } else if (permission == "PUT") {
          newArr.push("update_" + key)
        } else if (permission == "GET") {
          newArr.push("view_" + key)
        } else if (permission == "DELETE") {
          newArr.push("delete_" + key)
        }
      });
    });
    return newArr;
  }

  async returnPermissions(userRoleGroupsArr) {
    let permissionsArr = [];
    for (let data of userRoleGroupsArr) {
      if (data['role_id'] != "" && data['role_id'] != undefined) {
        let rolesResponse = await this.rolesService.findById(data['role_id']);
        let userPermissions = await this.generateName(rolesResponse['result']['permissions']);
        permissionsArr.push(...userPermissions)
      }
    }

    for (let data of userRoleGroupsArr) {
      if (data['group_id'] != "" && data['group_id'] != undefined) {
        let groupsResponse = await this.groupsService.findById(data['group_id']);
        let userPermissions = await this.generateName(groupsResponse['result']['permissions']);
        permissionsArr.push(...userPermissions)
      }
    }
    let permissions = new Set(...[permissionsArr]);
    return permissions;
  }

  @ApiOperation({ summary: 'get all User Role Grup Map' })
  @Get('/get-user-permissions/:user_id')
  @ApiHeader({name:"x-tenant-id"})
  @ApiBearerAuth()
  async findAllUserPermissions(@Param('user_id') user_id: string) {

    try {

      const response = await this.usersRolesGroupsMappingsService.findMany({ "user_id": user_id });
      let userRoleGroupsArr = response['result'];
      let permissions = Array.from(await this.returnPermissions(userRoleGroupsArr));
      return new Response(true, StatusCodes.OK, CustomMessages.SUCCESS, { "permissions": permissions });

    } catch (err) {
      throw new HttpException({ status: StatusCodes.INTERNAL_SERVER_ERROR, error: CustomMessages.INTERNAL_SERVER_ERROR, message: err },
        StatusCodes.INTERNAL_SERVER_ERROR, { cause: err });
    }
  }
}
