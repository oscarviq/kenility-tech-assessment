import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  app.enableCors({ origin: '*' });

  const config = new DocumentBuilder()
    .setTitle('Kenility API')
    .setDescription('Oscar Viquez | Tech Assessment')
    .setVersion('1.0')
    .addBearerAuth( // 👈 Add this line
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'access-token'
    )
    .build();

  SwaggerModule.setup('api', app, SwaggerModule.createDocument(app, config, { ignoreGlobalPrefix: false }));

  const port = process.env.PORT || 3000;
  await app.listen(port);
  Logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`);
}

bootstrap();
