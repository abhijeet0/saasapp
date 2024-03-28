import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../app.module';
import { UsersService } from './users.service';
import { getUserDto } from './users-dtos/get-users-dto';
import { ValidationPipe } from '@nestjs/common';
import { ValidationExceptionFilter } from '../exceptions-handling/validation-exception-filter';
import { log } from 'console';

describe('users', () => {
  let app: INestApplication;
  let usersService : UsersService;

  let userObj = {};
  let userId;
  beforeAll(async () => {

      const moduleRef = await Test.createTestingModule({
        imports: [AppModule],
      }).compile();
  
      usersService = await moduleRef.get<UsersService>(UsersService);
    app = moduleRef.createNestApplication();
    app.useGlobalFilters(new ValidationExceptionFilter());
    app.useGlobalPipes(new ValidationPipe());

    await app.init();
  });

  it(`/POST users`, async () => {
    
    const payload = {
       name:"john",
       email:"johncena@gmail.com",
       password:"John@123"
    };

    const response =  (await request(app.getHttpServer())
    .post('/v1/users').send(payload)).body;
    expect(response['statusCode']).toEqual(201);
    expect(response['isSuccess']).toEqual(true);

    if (response['isSuccess']) {

      let obj = {};
      obj['name'] = response['result']['name'];
      obj['email'] = response['result']['email'];
      expect({name:response['result']['name'],email:response['result']['email']}).toEqual(obj);

      userObj = response['result'];
      userId = userObj['id'];
    }
  });


  it(`/GET all user entries`, async () => {

    const response =  (await request(app.getHttpServer())
    .get('/v1/users?page=0&size=1')).body;

    expect(response['statusCode']).toEqual(200);
    expect(response['isSuccess']).toEqual(true);

    const dbResponse = await usersService.findAll({},1,0);
    expect(dbResponse['statusCode']).toEqual(200);
    expect(dbResponse['isSuccess']).toEqual(true);

    let dbResponseObject =  new getUserDto(dbResponse['result'][0]);

    let apiResponseObject = response['result'][0];
    apiResponseObject['created_at'] = new Date(apiResponseObject['created_at']);
    apiResponseObject['updated_at'] = new Date(apiResponseObject['updated_at']);

    expect(apiResponseObject).toEqual(dbResponseObject);
  });

  it(`/GET users by id entry`, async () => {

    const response =  (await request(app.getHttpServer())
    .get(`/v1/users/${userId}`)).body;
    
    expect(response['statusCode']).toEqual(200);
    expect(response['isSuccess']).toEqual(true);

    const dbResponse = await usersService.findById(userId);
    expect(dbResponse['statusCode']).toEqual(200);
    expect(dbResponse['isSuccess']).toEqual(true);

    let apiResponseObject = response['result'];
    apiResponseObject['created_at'] = new Date(apiResponseObject['created_at']);
    apiResponseObject['updated_at'] = new Date(apiResponseObject['updated_at']);

    let dbResponseObject =  new getUserDto(dbResponse['result']);
    expect(apiResponseObject).toEqual(dbResponseObject);

  });

  it(`/PUT users by id`, async () => {

    let payload = {};
    payload['name'] = "big";

    const response =  (await request(app.getHttpServer())
    .put(`/v1/users/${userId}`).send(payload)).body;
    expect(response['statusCode']).toEqual(200);
    expect(response['isSuccess']).toEqual(true);
    expect(response['result']['name']).toEqual(payload['name']);

  });

  it(`/DELETE users by id`, async () => {

    const response =  (await request(app.getHttpServer())
    .delete(`/v1/users/${userId}`)).body;
    expect(response['statusCode']).toEqual(200);
    expect(response['isSuccess']).toEqual(true);
  });

  it(`/POST users failed entry for name`, async () => {
    
    const payload = {
      "name": "1",
      "email": "john@gmail.com",
      "password":"dd"       
    };
    const response =  (await request(app.getHttpServer())
    .post('/v1/users').send(payload)).body;
    expect(response['statusCode']).toEqual(400);
    expect(response['isSuccess']).toEqual(false);
  });

  it(`/POST users failed entry for email`, async () => {
    
    const payload = {
       email:"johncenagmail.com",
    };
    const response =  (await request(app.getHttpServer())
    .post('/v1/users').send(payload)).body;
    expect(response['statusCode']).toEqual(400);
    expect(response['isSuccess']).toEqual(false);
  });
  afterAll(async () => {
    await app.close();
  });
});