import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { HttpExceptionFilter } from './helpers/http-exception-filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v2');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      // forbidNonWhitelisted: true,
      // transform: true,
      // transformOptions: {
      //   enableImplicitConversion: true
      // }
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());

  // Configure Swagger options
  const config = new DocumentBuilder()
    .setTitle('Screening AI API Docs')
    .setDescription('API Documentation for Screening AI')
    .setVersion('1.0')
    .addTag('api/v2') // Optional: Add tags for grouping
    .addApiKey(
      { type: 'apiKey', name: 'x-api-key', in: 'header' }, // API Key Auth
      'apiKeyAuth', // Name of the auth scheme
    )
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, // Bearer Auth
      'JWT', // Name of the auth scheme
    )
    .build();

  // Create Swagger document
  const document = SwaggerModule.createDocument(app, config);

  // Serve Swagger UI
  SwaggerModule.setup('api', app, document);

  // Use the logger
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
