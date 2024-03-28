import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../app.module';
import { RolesService } from './roles.service';
import { getRolesDto } from './roles-dtos/get-roles-dto';
import { ValidationExceptionFilter } from '../exceptions-handling/validation-exception-filter';

describe('roles', () => {
  let app: INestApplication;
  let rolesService : RolesService;

  let roleObj = {};
  let roleId;
  beforeAll(async () => {

      const moduleRef = await Test.createTestingModule({
        imports: [AppModule],
      }).compile();
  
      rolesService = await moduleRef.get<RolesService>(RolesService);
    app = moduleRef.createNestApplication();
    app.useGlobalFilters(new ValidationExceptionFilter());
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  it(`/POST roles`, async () => {
    
    const payload = {
       name:"admin",
       permissions:["CREATE","VIEW","UPDATE","VIEW ALL", "DELETE"]
    };

    const response =  (await request(app.getHttpServer())
    .post('/v1/roles').send(payload)).body;
    expect(response['statusCode']).toEqual(201);
    expect(response['isSuccess']).toEqual(true);

    if (response['isSuccess']) {

      let obj = {};
      obj['name'] = response['result']['name'];
      obj['permissions'] = response['result']['permissions'];
      expect(payload).toEqual(obj);
      roleObj = response['result'];
      roleId = roleObj['id'];
    }
  });

  it(`/GET all role entries`, async () => {

    const response =  (await request(app.getHttpServer())
    .get('/v1/roles?page=0&size=1')).body;

    expect(response['statusCode']).toEqual(200);
    expect(response['isSuccess']).toEqual(true);

    const dbResponse = await rolesService.findAll({},1,0);
    expect(dbResponse['statusCode']).toEqual(200);
    expect(dbResponse['isSuccess']).toEqual(true);

    let dbResponseObject =  new getRolesDto(dbResponse['result'][0]);

    let apiResponseObject = response['result'][0];
    apiResponseObject['created_at'] = new Date(apiResponseObject['created_at']);
    apiResponseObject['updated_at'] = new Date(apiResponseObject['updated_at']);

    expect(apiResponseObject).toEqual(dbResponseObject);
  });

  it(`/GET roles by id entries`, async () => {

    const response =  (await request(app.getHttpServer())
    .get(`/v1/roles/${roleId}`)).body;
    expect(response['statusCode']).toEqual(200);
    expect(response['isSuccess']).toEqual(true);

    const dbResponse = await rolesService.findById(roleId);

    expect(dbResponse['statusCode']).toEqual(200);
    expect(dbResponse['isSuccess']).toEqual(true);

    let apiResponseObject = response['result'];
    apiResponseObject['created_at'] = new Date(apiResponseObject['created_at']);
    apiResponseObject['updated_at'] = new Date(apiResponseObject['updated_at']);

    let dbResponseObject =  new getRolesDto(dbResponse['result']);
    expect(apiResponseObject).toEqual(dbResponseObject);

  });

  it(`/PUT roles by id`, async () => {

    let payload = {};
    payload['permissions'] = ["CREATE"];

    const response =  (await request(app.getHttpServer())
    .put(`/v1/roles/${roleId}`).send(payload)).body;
    expect(response['statusCode']).toEqual(200);
    expect(response['isSuccess']).toEqual(true);
    expect(response['result']['permissions']).toEqual(payload['permissions']);

  });

  it(`/DELETE roles by id`, async () => {

    const response =  (await request(app.getHttpServer())
    .delete(`/v1/roles/${roleId}`)).body;
    expect(response['statusCode']).toEqual(200);
    expect(response['isSuccess']).toEqual(true);
  });

  it(`/POST roles name failure check`, async () => {
    
    const payload = {
       name:"1",
       permissions:["CREATE","VIEW","UPDATE","VIEW ALL", "DELETE"]
    };

    const response =  (await request(app.getHttpServer())
    .post('/v1/roles').send(payload)).body;
    expect(response['statusCode']).toEqual(400);
    expect(response['isSuccess']).toEqual(false);

  });

  it(`/POST roles permissions failure check`, async () => {
    
    const payload = {
       name:"admin",
       permissions:"CREATE"
    };

    const response =  (await request(app.getHttpServer())
    .post('/v1/roles').send(payload)).body;
    expect(response['statusCode']).toEqual(400);
    expect(response['isSuccess']).toEqual(false);

  });
  afterAll(async () => {
    await app.close();
  });
});