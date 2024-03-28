import { Controller, Post, Body,Get,Query, Param, Delete, Put, HttpException, Inject  } from '@nestjs/common';
import { ApiTags,ApiOperation, ApiHeader, ApiBearerAuth } from '@nestjs/swagger';
import { CreateRequestForDemoDto } from './request-for-demo-dtos/create-request-for-demo-dto';
import { StatusCodes } from '../utils/status-codes';
import { CustomMessages } from '../utils/custom-messages';
import { RequestForDemoService } from './request-for-demo.service';
import { GetRequestForDemoDto } from './request-for-demo-dtos/get-request-for-demo-dto';
import { GetAllRequestForDemoDto } from './request-for-demo-dtos/get-all-request-for-demo-dto';
import { UpdateRequestForDemoDto } from './request-for-demo-dtos/update-request-for-demo-dto';
import { EventsService } from '../events/events.service';
import { EventsController } from 'src/events/events.controller';

@ApiTags('request-for-demo')
@Controller('v1/request-for-demo')
export class RequestForDemoController {
    public page;
    public size;
    
    constructor(private readonly requestForDemoService: RequestForDemoService,private readonly eventsService:EventsService,@Inject(EventsController) private readonly eventsController: EventsController) {
      this.page = 0;
      this.size = 10;
    }

    @ApiOperation({ summary: 'create request for demo'})
    @Post()
    // @ApiHeader({name:"x-tenant-id"})
    @ApiBearerAuth()
    async create(@Body() payload:CreateRequestForDemoDto){
      try {
  
        const response =  await this.requestForDemoService.create(payload);          
        if (response['isSuccess']) {
          let requestForDemoData =  new GetRequestForDemoDto(response['result']);
          let eventPayloadObj = {
            'start_date' : payload['event_details']['start_date'],
            'end_date' : payload['event_details']['end_date'],
            'description' : process.env['DESCRIPTION'],
            'location' : payload['event_details']['location'],
            'summary' : process['env']['SUMMARY'],
            'organizer_name' : process['env']['ORGANIZER_NAME'],
            'organizer_email' : process['env']['ORGANIZER_EMAIL'],
            'meeting_link' : "",
            'email_to' : process['env']['EMAIL_TO'],
            'email_from' : process['env']['EMAIL_FROM'],
            'email_subject' : process['env']['SUBJECT'],
          };
          const res = await this.eventsController.create(eventPayloadObj);
          response['result'] = requestForDemoData;     
        } 

        return response;
      } catch(err) {        
          throw new HttpException({status: StatusCodes.INTERNAL_SERVER_ERROR,error: CustomMessages.INTERNAL_SERVER_ERROR,message: err}, 
                StatusCodes.INTERNAL_SERVER_ERROR, {cause: err});      }
    }

    @ApiOperation({ summary: 'get all request for demo requests' })
    @Get()
    // @ApiHeader({name:"x-tenant-id"})
    @ApiBearerAuth()
    async findAll(@Query() query:GetAllRequestForDemoDto) {
      try {

        let size = query['size'] ? query['size'] : this.size;
        let page = query['page'] ? query['page'] : this.page;
        let filters;
        if (query['filters']) {
          filters = JSON.parse(query['filters'])   
        }
        let condition = {};
        condition = {...filters};
        const response =  await this.requestForDemoService.findAll(condition,size,page);
        let requestForDemoData = response['result'].map(data=>new GetRequestForDemoDto(data));
        response['result'] = requestForDemoData;
        return response;
      } catch(err) {
          throw new HttpException({status: StatusCodes.INTERNAL_SERVER_ERROR,error: CustomMessages.INTERNAL_SERVER_ERROR,message: err}, 
                StatusCodes.INTERNAL_SERVER_ERROR, {cause: err});      }
    }
  
    @ApiOperation({ summary: 'get request for demo by id' })
    @Get(':id')
    // @ApiHeader({name:"x-tenant-id"})
    @ApiBearerAuth()
    async findOne(@Param('id') id: string) {
      try {
        const response =  await this.requestForDemoService.findOne({_id:id});      
        if (response['isSuccess']) {
          const requestForDemoData = new GetRequestForDemoDto(response['result']);
          response['result'] = requestForDemoData;     
        } 

        return response;
      } catch(err) {
          throw new HttpException({status: StatusCodes.INTERNAL_SERVER_ERROR,error: CustomMessages.INTERNAL_SERVER_ERROR,message: err}, 
                StatusCodes.INTERNAL_SERVER_ERROR, {cause: err});      }
    }
  
    @ApiOperation({ summary: 'update request for demo by id'})
    @Put(':id')
    // @ApiHeader({name:"x-tenant-id"})
    @ApiBearerAuth()
    async update(@Param('id') id: string, @Body() payload: UpdateRequestForDemoDto) {
      try {
        let response = await this.requestForDemoService.update(id, payload);
        if (response['isSuccess']) {
          const requestForDemoData = new GetRequestForDemoDto(response['result']);
          response['result'] = requestForDemoData;     
        } 

        return response;
      } catch(err) {
          throw new HttpException({status: StatusCodes.INTERNAL_SERVER_ERROR,error: CustomMessages.INTERNAL_SERVER_ERROR,message: err}, 
                StatusCodes.INTERNAL_SERVER_ERROR, {cause: err});      }
    }
  
    @Delete(':id')
    // @ApiHeader({name:"x-tenant-id"})
    @ApiBearerAuth()
    async remove(@Param('id') id: string) {
      try {
        return this.requestForDemoService.delete(id);
      } catch(err) {
          throw new HttpException({status: StatusCodes.INTERNAL_SERVER_ERROR,error: CustomMessages.INTERNAL_SERVER_ERROR,message: err}, 
                StatusCodes.INTERNAL_SERVER_ERROR, {cause: err});      }
    }

}
