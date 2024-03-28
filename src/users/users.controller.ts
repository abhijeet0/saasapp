import { Controller, Get, Post, Body, Param, Put, Delete, Query, HttpException, Inject, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CustomMessages } from '../utils/custom-messages';
import { StatusCodes } from '../utils/status-codes';
import { Response } from '../utils/response';
import { ApiTags,ApiOperation, ApiBearerAuth, ApiHeader } from '@nestjs/swagger';
import { UpdateUserDto } from './users-dtos/update-users-dto';
import { CreateUserDto } from './users-dtos/create-users-dto';
import { GetAllUsersDto } from './users-dtos/get-all-users-dto';
import { getUserDto } from './users-dtos/get-users-dto';
import { TenantsController } from 'src/tenants/tenant.controller';
import { ConfidentialClientApplication } from '@azure/msal-node';
import fetch from 'node-fetch';
import { AzureAdService } from 'src/adapter-classes/azure-ad-service';
import { Constants } from 'src/utils/constants';
import  cloud_type  from 'src/main';
// import { AzureTokenAuthGuard } from 'src/auth/auth-guard';
import { RolesController } from 'src/roles/roles.controller';
import { EmailService } from 'src/email-send/email-send.service';
import * as path from 'path';
import * as handlebars from 'handlebars';
import * as fs from 'fs';

@ApiTags('users')
@Controller('v1/users')
export class UsersController {
  public page;
  public size;

  constructor(private readonly usersService: UsersService,@Inject(TenantsController) private readonly tenantController: TenantsController,@Inject(RolesController) private readonly rolesController,private readonly emailService: EmailService) {
    this.page = 0;
    this.size = 10;
  }

  @ApiOperation({ summary: 'create new user'})
  @Post()
  @ApiHeader({name:"x-tenant-id"})
  @ApiBearerAuth()
  // @UseGuards(AzureTokenAuthGuard)

  async create(@Body() payload: CreateUserDto){
    try {      
      if (payload['azure_user_id'] != "") {
        const response = await this.usersService.create(payload);
        if (response['isSuccess']) {
          const userData = new getUserDto(response['result']);       
          response['result'] = userData; 
        }
        return response;  
      } else {
        let azureResponse = await AzureAdService.createUser(payload);

        // let azureResponse = await cloud_type.createUser(payload);        
        if (azureResponse['isSuccess']) {
            console.log("----",azureResponse);
            payload['azure_user_id'] = azureResponse['result']['ad_user_id']
            const response = await this.usersService.create(payload);
            if (response['isSuccess']) {
              const userData = new getUserDto(response['result']);       
              response['result'] = userData; 
            }
            return response;    
        } else {
          return azureResponse;
        }
      }
 
    } catch(err) {      
        throw new HttpException({status: StatusCodes.INTERNAL_SERVER_ERROR,error: CustomMessages.INTERNAL_SERVER_ERROR,message: err}, 
                StatusCodes.INTERNAL_SERVER_ERROR, {cause: err});    
    }
  }

  @ApiOperation({ summary: 'create new signup'})
  @Post('create-instance')
  @ApiHeader({name:"x-tenant-id"})
  // @ApiBearerAuth()
  async Signup(@Body() payload: CreateUserDto){
    try {
      console.log("------");
      
      let tenantPayload = {
        'company_name' : payload['organization']
      };
      let tenantResponse = await this.tenantController.create(tenantPayload);
      console.log("tenantResponse",tenantResponse);
      
      if (tenantResponse['isSuccess']) {          
        let azureResponse = await AzureAdService.createUser(payload);

        // let azureResponse = await cloud_type.createUser(payload);        
        if (azureResponse['isSuccess']) {
            console.log("----",azureResponse);
            payload['azure_user_id'] = azureResponse['result']['ad_user_id']
            const response = await this.usersService.create(payload);
            if (response['isSuccess']) {
              const userData = new getUserDto(response['result']);       
              response['result'] = userData; 
            }
            return response;    
        } else {
          return azureResponse;
        }
      } else {
        return tenantResponse
      }
    } catch(err) {      
        throw new HttpException({status: StatusCodes.INTERNAL_SERVER_ERROR,error: CustomMessages.INTERNAL_SERVER_ERROR,message: err}, 
                StatusCodes.INTERNAL_SERVER_ERROR, {cause: err});    }
  }

  @ApiOperation({ summary: 'get all users' })
  @Get()
  @ApiHeader({name:"x-tenant-id"})
  @ApiBearerAuth()
  async findAll(@Query() query:GetAllUsersDto) {

    try { 
      let size:number = query['size'] ? query['size'] : this.size;
      let page:number = query['page'] ? query['page'] : this.page;
      let filters = {};
      if (query['filters']) {
        filters = JSON.parse(query['filters'])   
      }
      let condition = {};
      condition = {...filters};
      const response = await this.usersService.findAll(condition,size,page);
      let usersData = response['result'].map(data=>new getUserDto(data));
      response['result'] = usersData;
      return response;
    } catch(err) {   
        throw new HttpException({status: StatusCodes.INTERNAL_SERVER_ERROR,error: CustomMessages.INTERNAL_SERVER_ERROR,message: err}, 
                StatusCodes.INTERNAL_SERVER_ERROR, {cause: err});    }
  }

  @ApiOperation({ summary: 'get user by id' })
  @Get(':id')
  @ApiHeader({name:"x-tenant-id"})
  @ApiBearerAuth()
  async findOne(@Param('id') id: string) {
    try {
      const response =  await this.usersService.findOne({_id:id});
      if (response['isSuccess']) {
        const userData = new getUserDto(response['result']);      
        response['result'] = userData;
      } 
      return response;
    } catch(err) {
        throw new HttpException({status: StatusCodes.INTERNAL_SERVER_ERROR,error: CustomMessages.INTERNAL_SERVER_ERROR,message: err}, 
                StatusCodes.INTERNAL_SERVER_ERROR, {cause: err});
    }
  }

  @ApiOperation({ summary: 'update user by id'})
  @Put(':id')
  @ApiHeader({name:"x-tenant-id"})
  @ApiBearerAuth()
  async update(@Param('id') id: string, @Body() payload: UpdateUserDto) {

    try {
      const response = await this.usersService.update(id, payload);
      if (response['isSuccess']) {
       
        const userData = new getUserDto(response['result']);
        response['result'] = userData;     
      } 
      return response;
    } catch(err) {
        throw new HttpException({status: StatusCodes.INTERNAL_SERVER_ERROR,error: CustomMessages.INTERNAL_SERVER_ERROR,message: err}, 
                StatusCodes.INTERNAL_SERVER_ERROR, {cause: err});    }
  }

  @ApiOperation({ summary: 'delete user by id'})
  @Delete(':id')
  @ApiHeader({name:"x-tenant-id"})
  async remove(@Param('id') id: string) {

    try {
      return await this.usersService.delete(id);
    } catch(err) {
        throw new HttpException({status: StatusCodes.INTERNAL_SERVER_ERROR,error: CustomMessages.INTERNAL_SERVER_ERROR,message: err}, 
                StatusCodes.INTERNAL_SERVER_ERROR, {cause: err});    
    }
  }

  @ApiOperation({ summary: 'get user by azure_id' })
  @Get('/get-by-azure-user-id/:azure_user_id')
  @ApiHeader({name:"x-tenant-id"})
  @ApiBearerAuth()
  async findByAzureId(@Param('azure_user_id') azure_user_id: string) {
    try {      
      const response =  await this.usersService.findOne({azure_user_id:azure_user_id});
      if (response['isSuccess']) {
        const userData = new getUserDto(response['result']); 
        let permissionsResponse = await  this.rolesController.findAllUserPermissions(userData['id']);
        let res = await AzureAdService.resetUserPassword(azure_user_id,"Xyz@123poppooo","Xyz@123poppoo1");
        console.log("----",res);
        
        userData["permissions"] = permissionsResponse['result']['permissions'];
        response['result'] = userData;
      } 
      return response;
    } catch(err) {
        throw new HttpException({status: StatusCodes.INTERNAL_SERVER_ERROR,error: CustomMessages.INTERNAL_SERVER_ERROR,message: err}, 
                StatusCodes.INTERNAL_SERVER_ERROR, {cause: err});
    }
  }

  @ApiOperation({ summary: 'get user by azure_id' })
  @Post('/forgot-password/:user_id')
  @ApiHeader({name:"x-tenant-id"})
  @ApiBearerAuth()
  async forgotPassowrd(@Param("user_id") user_id:string) {
    try {      
      const response =  await this.usersService.findById(user_id);
      const templateContent = fs.readFileSync("/home/dell/Documents/bpht/common_template/src/templates/forgot-password-mail-template.hbs", 'utf8');
      const template = handlebars.compile(templateContent);

      const templateData = {
        user_name:response['result']['first_name'] + " "+ response['result']['last_name'],
        reset_link:"#"
      }
      const html = template(templateData);
      const mailResponse = await this.emailService.sendEmailWithTemplate(process.env.EMAIL_FROM,process.env.EMAIL_FROM,"Forgot Password",html,templateData);    
      return mailResponse; 
    } catch(err) {
      console.log("err----",err);
        throw new HttpException({status: StatusCodes.INTERNAL_SERVER_ERROR,error: CustomMessages.INTERNAL_SERVER_ERROR,message: err}, 
                StatusCodes.INTERNAL_SERVER_ERROR, {cause: err});
    }
  }

  // @ApiOperation({ summary: 'get user by azure_id' })
  // @Post('/reset-password/:user_id')
  // @ApiHeader({name:"x-tenant-id"})
  // @ApiBearerAuth()
  // async resetPassowrd(@Body() payload:string,@Param('user_id') user_id:string) {
  //   try {      
  //     const response =  await this.usersService.findById(user_id);
  //     // const template = handlebars.compile(templateContent);

  //     const templateData = {
  //       user_name:response['result']['first_name'] + " "+ response['result']['last_name'],
  //       reset_link:"#"
  //     }
  //     const mailResponse = await this.emailService.sendEmailWithTemplate(process.env.EMAIL_FROM,process.env.EMAIL_FROM,"Forgot Password",html,templateData);    
  //     return mailResponse; 
  //   } catch(err) {
  //     console.log("err----",err);
  //       throw new HttpException({status: StatusCodes.INTERNAL_SERVER_ERROR,error: CustomMessages.INTERNAL_SERVER_ERROR,message: err}, 
  //               StatusCodes.INTERNAL_SERVER_ERROR, {cause: err});
  //   }
  // }

  // @ApiOperation({ summary: 'check user credenctials' })
  // @Get('/login/:email')
  // async userLogin(@Param('email') email: string) {
  //   try {
  //     console.log("inside userlogin");
      
  //     const response = await this.loginUser();
  //     console.log("inside userlogin---");

  //     if (response['isSuccess']) {
  //       const userData = new getUserDto(response['result']);      
  //       response['result'] = userData;
  //     } 
  //     return response;
  //   } catch(err) {
  //     console.log("err",err);
      
  //       throw new HttpException({status: StatusCodes.INTERNAL_SERVER_ERROR,error: CustomMessages.INTERNAL_SERVER_ERROR,message: err}, 
  //               StatusCodes.INTERNAL_SERVER_ERROR, {cause: err});
  //   }
  // }

  // async getAccessToken() {  
  //   try {
  //     const msalConfig = {
  //       auth: {
  //         clientId: process.env.CLIENT_ID,
  //         authority: `https://login.microsoftonline.com/${process.env.TOKEN_ID}`,
  //         clientSecret: process.env.CLIENT_SECRET
  //       }
  //     };
  //     const msalClient = new ConfidentialClientApplication(msalConfig);
  //     const tokenRequest = {
  //       scopes: ['https://graph.microsoft.com/.default']
  //     };
  //     const response = await msalClient.acquireTokenByClientCredential(tokenRequest);
  //     return response.accessToken;
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  // async createUser(userObj) {  
  //   try {      
  //     const accessToken = await this.getAccessToken();
  //     const apiUrl = 'https://graph.microsoft.com/v1.0/users';
  //     const requestOptions = {
  //       method: 'POST',
  //       headers: {
  //         Authorization: `Bearer ${accessToken}`,
  //         'Content-Type': 'application/json'
  //       },
  //       body: JSON.stringify({
  //         accountEnabled: true,
  //         displayName: userObj['first_name'] + " " + userObj['last_name'] ,
  //         mailNickname: userObj['first_name'],
  //         userPrincipalName: userObj['email'],
  //         passwordProfile: {
  //           forceChangePasswordNextSignIn: true,
  //           password: userObj['password']
  //         }
  //       })
  //     };
      
  //     const azureResponse = await fetch(apiUrl, requestOptions);
  //     let responseObj = await azureResponse.json(); 
  //     console.log("responseObj",responseObj);
      
  //     if (responseObj['id']) {
  //       let userObj = {};
  //       userObj['ad_user_id'] = responseObj['id'];
  //       return new Response(true, StatusCodes.OK, CustomMessages.SUCCESS, userObj);
  //     } else {
  //       return new Response(false, StatusCodes.BAD_REQUEST, CustomMessages.BAD_REQUEST, {});
  //     }
  //   } catch (error) {
  //     return new Response(false, StatusCodes.INTERNAL_SERVER_ERROR, CustomMessages.INTERNAL_SERVER_ERROR, {});
  //   }
  // }

  // async loginUser() {  
    
  //   try {   

  //     const accessToken = await this.getAccessToken();
  //     const apiUrl = 'https://graph.microsoft.com/v1.0/users/Xyz@123poppoo';
  //     const requestOptions = {
  //       method: 'GET',
  //       headers: {
  //         Authorization: `Bearer ${accessToken}`,
  //         'Content-Type': 'application/json'
  //       },
  //     };
      
  //     const azureResponse = await fetch(apiUrl, requestOptions);
  //     let responseObj = await azureResponse.json(); 
  //     console.log("responseObj",responseObj);
      
  //     if (responseObj['id']) {
  //       let userObj = {};
  //       userObj['ad_user_id'] = responseObj['id'];
  //       return new Response(true, StatusCodes.OK, CustomMessages.SUCCESS, userObj);
  //     } else {
  //       return new Response(false, StatusCodes.BAD_REQUEST, CustomMessages.BAD_REQUEST, {});
  //     }
  //   } catch (error) {
  //     return new Response(false, StatusCodes.INTERNAL_SERVER_ERROR, CustomMessages.INTERNAL_SERVER_ERROR, {});
  //   }
  // }
}
