import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationExceptionFilter } from './exceptions-handling/validation-exception-filter';
import { ValidationPipe } from '@nestjs/common';
import * as csurf from 'csurf';
import helmet from 'helmet';
import { ConfigService } from '@nestjs/config';
import { AzureAdService } from './adapter-classes/azure-ad-service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle(process.env.PROJECT_NAME)
    .setDescription(process.env.PROJECT_DESCRIPTION)
    .setVersion('1.0')
    .addBearerAuth()
    .addTag(process.env.PROJECT_TAG)
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.use(helmet());
  app.enableCors({
    origin: [
      process.env.LOCAL_HOST
    ],
  });
  app.useGlobalFilters(new ValidationExceptionFilter());
  app.useGlobalPipes(new ValidationPipe({transform: true}));

  await app.listen(process.env.HTTP_PORT || 4000);
}
bootstrap();

let cloud_type;


function setCloudType() {
    console.log("===--",process.env.SSO_TYPE)
    if (process.env.SSO_TYPE == "azure") { 
        return cloud_type = new AzureAdService();
    } else {
      return cloud_type = "hey"
    }
}
setCloudType();
export default cloud_type;