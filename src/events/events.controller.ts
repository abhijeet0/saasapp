import { Controller, Get, Post, Body, Param, Put, Delete, Query, UseFilters, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { EventsService } from './events.service';
import { CustomMessages } from '../utils/custom-messages';
import { StatusCodes } from '../utils/status-codes';
import { Response } from '../utils/response';
import { ApiTags,ApiOperation } from '@nestjs/swagger';
import { CreateEventDto } from './events-dtos/create-event-dto';
import { GenerateEventDto } from './events-dtos/generate-event-dto';
import { EmailService } from 'src/email-send/email-send.service';
// import { GetAllGroupsDto } from './events-dtos/get-all-events-dto';
// import { getGroupsDto } from './events-dtos/get-events-dto';
const ical = require('ical-generator').default;

@ApiTags('events')
@Controller('v1/events')
export class EventsController {
    // public page;
    // public size;

    constructor(private readonly eventsService: EventsService,private readonly emailService: EmailService) {
        // this.page = 0;
        // this.size = 10;
    }

    createEventObj = async (payload) => {
        const eventObj = ical();
        eventObj.createEvent({
            start: payload.start_date,        
            end: payload.end_date,             
            summary: payload.summary,         
            description: payload.description, 
            location: payload.location,       
            url: payload.meeting_link,                 
            organizer: {              
                name: payload.organizer_name,
                email: payload.organizer_email
            },
        });
        return eventObj;
    }

    createEmailObj = async (eventObj) => {
        let emailAlternativeObj = {
            "Content-Type": "text/calendar",
            "method": "REQUEST",
            "content": Buffer.alloc(eventObj.toString()),
            "component": "VEVENT",
            "Content-Class": "urn:content-classes:calendarmessage",
            "contentType":'text/calendar',
        }
        return emailAlternativeObj;
    }

    createEventStorePayloadObj = async (payload) =>{

        let eventPayloadObj:CreateEventDto = {
            summary : payload.summary,
            start_date : payload.start_date,
            end_date : payload.end_date,
            type : payload.type,
            event_details : {
                description:payload.description,
                location:payload.location,
                organizer_name:payload.organizer_name,
                organizer_email:payload.organizer_email,
                meeting_link:payload.meeting_link,
                email_to:payload.email_to,
                email_from:payload.email_from,
                email_subject:payload.email_subject
            }
        }
        return eventPayloadObj;
    }

    async create(@Body() payload: GenerateEventDto) {
        try {

            const eventObj = await this.createEventObj(payload);
            // const emailObj = await this.createEmailObj(eventObj);
            const eventStoreObj:CreateEventDto = await this.createEventStorePayloadObj(payload);
            let emailRes = await this.emailService.sendEmailWithEvent(payload.email_to,"event","",eventObj)
            const response = await this.eventsService.create(eventStoreObj);
            return response;
        } catch(err) {
            throw new HttpException({status: StatusCodes.INTERNAL_SERVER_ERROR,error: CustomMessages.INTERNAL_SERVER_ERROR,message: err}, 
                StatusCodes.INTERNAL_SERVER_ERROR, {cause: err});
            // return new Response(false, StatusCodes.INTERNAL_SERVER_ERROR, CustomMessages.INTERNAL_SERVER_ERROR, {});
        }
    }

//   @ApiOperation({ summary: 'get all event' })
//   @Get()
//   async findAll(@Query() query:GetAllGroupsDto) {

//     try {  
//       let size = query['size'] ? query['size'] : this.size;
//       let page = query['page'] ? query['page'] : this.page;
//       let filters;
//       if (query['filters']) {
//         filters = JSON.parse(query['filters'])   
//       }
//       let condition = {};
//       condition = {...filters};
//       const response = await this.eventsService.findAll(condition,size,page);
//       let eventsData = response['result'].map(data=>new getGroupsDto(data));
//       response['result'] = eventsData;
//       return response;
//     } catch {
// throw new HttpException({status: StatusCodes.INTERNAL_SERVER_ERROR,error: CustomMessages.INTERNAL_SERVER_ERROR,message: err}, 
                // StatusCodes.INTERNAL_SERVER_ERROR, {cause: err});//     }
//   }

//   @ApiOperation({ summary: 'get event by id' })
//   @Get(':id')
//   async findOne(@Param('id') id: string) {

//     try {
//       const response = await this.eventsService.findOne({_id:id});
//       if (response['isSuccess']) {
       
//         const eventData = new getGroupsDto(response['result']);  
//         response['result'] = eventData;      
//       } 
//       return response;
//     } catch(err) {
// throw new HttpException({status: StatusCodes.INTERNAL_SERVER_ERROR,error: CustomMessages.INTERNAL_SERVER_ERROR,message: err}, 
                // StatusCodes.INTERNAL_SERVER_ERROR, {cause: err});
//     }
//   }

//   @Delete(':id')
//   remove(@Param('id') id: string) {

//     try {
//       return this.eventsService.delete(id);
//     } catch(err) {
// throw new HttpException({status: StatusCodes.INTERNAL_SERVER_ERROR,error: CustomMessages.INTERNAL_SERVER_ERROR,message: err}, 
                // StatusCodes.INTERNAL_SERVER_ERROR, {cause: err});//     }
//   }
}
