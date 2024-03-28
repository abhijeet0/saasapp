import { HttpException, Inject, Injectable, MiddlewareConsumer, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { RolesService } from './roles.service';
import { AzureAdService } from 'src/adapter-classes/azure-ad-service';
import { UsersService } from 'src/users/users.service';
import { UsersRolesGroupsMappingsService } from 'src/users-roles-groups-mappings/users-roles-groups-mappings.service';
import { GroupsService } from 'src/groups/groups.service';
import { StatusCodes } from 'src/utils/status-codes';
import { CustomMessages } from 'src/utils/custom-messages';
import { Response as myResponse } from 'src/utils/response';

@Injectable()
export class RolesMiddleware implements NestMiddleware {
  constructor(private roleService: RolesService, @Inject(UsersRolesGroupsMappingsService) private userGroupRoleService: UsersRolesGroupsMappingsService, @Inject(UsersService) private usersService: UsersService, @Inject(GroupsService) private groupsService: GroupsService) { }
  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const apiRoute = (req.route.path).split("/");
      console.log("route----",!apiRoute.includes("create-instance"));
      if (!apiRoute.includes("create-instance")) {
        console.log("--------111");
        
        const azureUserId = await AzureAdService.getUserIdFromToken("eyJhbGciOiJSUzI1NiIsImtpZCI6Ilg1ZVhrNHh5b2pORnVtMWtsMll0djhkbE5QNC1jNTdkTzZRR1RWQndhTmsiLCJ0eXAiOiJKV1QifQ.eyJ2ZXIiOiIxLjAiLCJpc3MiOiJodHRwczovL2VsYWJhc3Npc3QuYjJjbG9naW4uY29tL2Q4OTRmNjY3LTMxMmEtNDg3My1hNzcxLTExZDk5NWE4OTdmYy92Mi4wLyIsInN1YiI6ImVmMDc5YTE1LWY1MGQtNGYyYi05YmRlLTY2NmEzODJkZDA3NSIsImF1ZCI6ImE1NTI2YjJlLTFiMjctNDkzNy05ZjI4LWUyNDQ2NWQ2MTMyYiIsImV4cCI6MTcxMDE0ODQ0Mywibm9uY2UiOiI2ZDlkODFhYy1iMWQzLTRlYTctOGI5NS1hZjU1ZTY4MTE1Y2UiLCJpYXQiOjE3MTAxNDQ4NDMsImF1dGhfdGltZSI6MTcxMDE0NDgzOSwib2lkIjoiZWYwNzlhMTUtZjUwZC00ZjJiLTliZGUtNjY2YTM4MmRkMDc1IiwiZXh0ZW5zaW9uX0ZpcnN0TmFtZSI6IkFtYXIiLCJleHRlbnNpb25fTGFzdE5hbWUiOiJQYW5jaGFsIiwiZXh0ZW5zaW9uX01vYmlsZU51bWJlciI6Ijk1NDUyMjQwOTgiLCJleHRlbnNpb25fTGFiTmFtZSI6IkVMYWIiLCJjb3VudHJ5IjoiSW5kaWEiLCJzdGF0ZSI6Ik1haGFyYXNodHJhIiwiY2l0eSI6IlB1bmUiLCJleHRlbnNpb25fTGFiQWRkcmVzcyI6IlB1bmUiLCJwb3N0YWxDb2RlIjoiNDMxNTE3IiwidGZwIjoiQjJDXzFfU2lnbkluU2lnblVwIiwibmJmIjoxNzEwMTQ0ODQzfQ.aiDI8scbXrUYR2oA_jcW6JVhHXzIYi2aXI4Uzg1Fo9NbujQc9nM8RkKXJQqsc4RfuKb3Lr3VxKn8vcvztcQ5l-ogYHkQ62l2gXQQNbKyD85gJ5Agfg2Xl5-0XWY_FaBa9DjLeYhf9DWd0EB6wZMlRwLxActZExEH14gXn6Ynfb7013sIEgXA1pEyM_BFQcfoBarH59apOrABiA2BWpV8oZlcutYElXx5wkl0VEXbu0vyMaxH0S26pviLksaa8Sm8cBSilaTWlo6YmSIuMt4I85ayqWvsHiSWtYCeZgMOztZdWnch6xrKBb9oC0rtEEea2AyxDdlauWEnSW_WcUGZuw");      
        console.log("azureUserId",azureUserId);
        
        if (azureUserId) {
          const userId = (await this.usersService.findOne({ azure_user_id: azureUserId }))['result']['_id'];
          if (userId) {
            const userMappingResponse = await this.userGroupRoleService.findMany({ user_id: userId });
            const mappingArray = userMappingResponse['result'];
            const route = (req.route.path).split("/")[2];
            const method = req.method;
            let permissionAccess = false;
            for (const element of mappingArray) {
              if (element['group_id'] != "" && element['group_id'] != undefined) {
                const groupsResponse = await this.groupsService.findById(element['group_id']);
                let groupPermissionKeys = Object.keys(groupsResponse['result']['permissions']);
                for (const key of groupPermissionKeys) {
                  if (key == route) {
                    const permissions = groupsResponse['result']['permissions'][key];
                    if (permissions.includes(method)) {
                      permissionAccess = true;
                      break;
                    }
                  }
                }
                if (permissionAccess) {
                  break;
                }
              } else if (element['role_id'] != "" && element['role_id'] != undefined) {
                const rolesResponse = await this.roleService.findById(element['role_id']);
                let rolePermissionKeys = Object.keys(rolesResponse['result']['permissions']);
                for (const key of rolePermissionKeys) {
                  if (key == route) {
                    const permissions = rolesResponse['result']['permissions'][key];
                    if (permissions.includes(method)) {
                      permissionAccess = true;
                      break;
                    }
                  }
                }
                if (permissionAccess) {
                  break;
                }
              }
            }
            if (!permissionAccess) {
              return res.json(new myResponse(false, StatusCodes.UNAUTHORIZED, CustomMessages.PERMISSION_DENIED, {}));
            }
            next();
          } else {
            return res.json(new myResponse(false, StatusCodes.UNAUTHORIZED, CustomMessages.PERMISSION_DENIED, {}));
          }
        } else {
          return res.json(new myResponse(false, StatusCodes.UNAUTHORIZED, CustomMessages.PERMISSION_DENIED, {}));
        }
      } else {
        next();
      }
      
 
    } catch (err) {
      return res.json(new myResponse(false, StatusCodes.UNAUTHORIZED, CustomMessages.PERMISSION_DENIED, {}));
    }
  }
}
