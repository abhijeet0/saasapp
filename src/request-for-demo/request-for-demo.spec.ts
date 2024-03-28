import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { RequestForDemoService } from './request-for-demo.service';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../app.module';
import { GetRequestForDemoDto } from './request-for-demo-dtos/get-request-for-demo-dto';
import { ValidationExceptionFilter } from '../exceptions-handling/validation-exception-filter';

describe('request for demo', () => {
  let app: INestApplication;
  let requestForDemoService : RequestForDemoService;

  let reqForDemoObj = {};
  let reqForDemoId;
  beforeAll(async () => {

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
  
    requestForDemoService = await moduleRef.get<RequestForDemoService>(RequestForDemoService);
    app = moduleRef.createNestApplication();
    app.useGlobalFilters(new ValidationExceptionFilter());
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  it(`/POST request-for-demo`, async () => {
    
    const payload = {
       first_name:"john",
       last_name:"cena",
       status:"open",
       email:"johncena@gmail.com"
    };

    const response =  (await request(app.getHttpServer())
    .post('/v1/request-for-demo').send(payload)).body;
    expect(response['statusCode']).toEqual(201);
    expect(response['isSuccess']).toEqual(true);

    if (response['isSuccess']) {

      let obj = {};
      obj['first_name'] = response['result']['first_name'];
      obj['last_name'] = response['result']['last_name'];
      obj['email'] = response['result']['email'];
      obj['status'] = response['result']['status'];
      expect(payload).toEqual(obj);
      reqForDemoObj = response['result'];
      reqForDemoId = reqForDemoObj['id'];
    }
  });

  it(`/GET request-for-demo all entries`, async () => {

    const response =  (await request(app.getHttpServer())
    .get(`/v1/request-for-demo/${reqForDemoId}`)).body;
    expect(response['statusCode']).toEqual(200);
    expect(response['isSuccess']).toEqual(true);

    const dbResponse = await requestForDemoService.findById(reqForDemoId);
    expect(dbResponse['statusCode']).toEqual(200);
    expect(dbResponse['isSuccess']).toEqual(true);

    let apiResponseObject = response['result'];
    apiResponseObject['created_at'] = new Date(apiResponseObject['created_at']);
    apiResponseObject['updated_at'] = new Date(apiResponseObject['updated_at']);

    let dbResponseObject =  new GetRequestForDemoDto(dbResponse['result']);
    expect(apiResponseObject).toEqual(dbResponseObject);

  });

  it(`/PUT request-for-demo by id`, async () => {

    let payload = {};
    payload['first_name'] = "big";

    const response =  (await request(app.getHttpServer())
    .put(`/v1/request-for-demo/${reqForDemoId}`).send(payload)).body;
    expect(response['statusCode']).toEqual(200);
    expect(response['isSuccess']).toEqual(true);
    expect(response['result']['first_name']).toEqual(payload['first_name']);

  });

  it(`/DELETE request-for-demo by id`, async () => {

    const response =  (await request(app.getHttpServer())
    .delete(`/v1/request-for-demo/${reqForDemoId}`)).body;
    expect(response['statusCode']).toEqual(200);
    expect(response['isSuccess']).toEqual(true);
  });

  it(`/POST request-for-demo name failure`, async () => {
    
    const payload = {
       first_name:"1",
       last_name:"cena",
       status:"open",
       email:"johncena@gmail.com"
    };

    const response =  (await request(app.getHttpServer())
    .post('/v1/request-for-demo').send(payload)).body;
    expect(response['statusCode']).toEqual(400);
    expect(response['isSuccess']).toEqual(false);

  });

  it(`/POST request-for-demo email failure`, async () => {
    
    const payload = {
       first_name:"john",
       last_name:"cena",
       status:"open",
       email:"johncenagmail.com"
    };

    const response =  (await request(app.getHttpServer())
    .post('/v1/request-for-demo').send(payload)).body;
    expect(response['statusCode']).toEqual(400);
    expect(response['isSuccess']).toEqual(false);

  });

  afterAll(async () => {
    await app.close();
  });
});