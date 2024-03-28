import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../app.module';
import { GroupsService } from './groups.service';
import { getGroupsDto } from './groups-dtos/get-groups-dto';
import { ValidationExceptionFilter } from '../exceptions-handling/validation-exception-filter';

describe('groups', () => {
  let app: INestApplication;
  let groupsService : GroupsService;

  let groupObj = {};
  let groupId;
  beforeAll(async () => {

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
  
    groupsService = await moduleRef.get<GroupsService>(GroupsService);
    app = moduleRef.createNestApplication();
    app.useGlobalFilters(new ValidationExceptionFilter());
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  it(`/POST groups`, async () => {
    
    const payload = {
       name:"admin",
       permissions:["CREATE","VIEW","UPDATE","VIEW ALL", "DELETE"]
    };

    const response =  (await request(app.getHttpServer())
    .post('/v1/groups').send(payload)).body;
    expect(response['statusCode']).toEqual(201);
    expect(response['isSuccess']).toEqual(true);

    if (response['isSuccess']) {

      let obj = {};
      obj['name'] = response['result']['name'];
      obj['permissions'] = response['result']['permissions'];
      expect(payload).toEqual(obj);
      groupObj = response['result'];
      groupId = groupObj['id'];
    }
  });


  it(`/GET all group entries`, async () => {

    const response =  (await request(app.getHttpServer())
    .get('/v1/groups?page=0&size=1')).body;

    expect(response['statusCode']).toEqual(200);
    expect(response['isSuccess']).toEqual(true);

    const dbResponse = await groupsService.findAll({},1,0);
    expect(dbResponse['statusCode']).toEqual(200);
    expect(dbResponse['isSuccess']).toEqual(true);

    let dbResponseObject =  new getGroupsDto(dbResponse['result'][0]);

    let apiResponseObject = response['result'][0];
    apiResponseObject['created_at'] = new Date(apiResponseObject['created_at']);
    apiResponseObject['updated_at'] = new Date(apiResponseObject['updated_at']);

    expect(apiResponseObject).toEqual(dbResponseObject);
  });
  
  it(`/GET groups by id entries`, async () => {

    const response =  (await request(app.getHttpServer())
    .get(`/v1/groups/${groupId}`)).body;
    expect(response['statusCode']).toEqual(200);
    expect(response['isSuccess']).toEqual(true);

    const dbResponse = await groupsService.findById(groupId);

    expect(dbResponse['statusCode']).toEqual(200);
    expect(dbResponse['isSuccess']).toEqual(true);

    let apiResponseObject = response['result'];
    apiResponseObject['created_at'] = new Date(apiResponseObject['created_at']);
    apiResponseObject['updated_at'] = new Date(apiResponseObject['updated_at']);

    let dbResponseObject =  new getGroupsDto(dbResponse['result']);
    expect(apiResponseObject).toEqual(dbResponseObject);

  });

  it(`/PUT groups by id`, async () => {

    let payload = {};
    payload['permissions'] = ["CREATE"];

    const response =  (await request(app.getHttpServer())
    .put(`/v1/groups/${groupId}`).send(payload)).body;
    expect(response['statusCode']).toEqual(200);
    expect(response['isSuccess']).toEqual(true);
    expect(response['result']['permissions']).toEqual(payload['permissions']);

  });

  it(`/DELETE groups by id`, async () => {

    const response =  (await request(app.getHttpServer())
    .delete(`/v1/groups/${groupId}`)).body;
    expect(response['statusCode']).toEqual(200);
    expect(response['isSuccess']).toEqual(true);
  });

  it(`/POST groups name faliure check`, async () => {
    
    const payload = {
       name:"1",
       permissions:["CREATE","VIEW","UPDATE","VIEW ALL", "DELETE"]
    };

    const response =  (await request(app.getHttpServer())
    .post('/v1/groups').send(payload)).body;
    expect(response['statusCode']).toEqual(400);
    expect(response['isSuccess']).toEqual(false);

  });

  afterAll(async () => {
    await app.close();
  });
});