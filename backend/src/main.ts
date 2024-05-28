import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useGlobalPipes(new ValidationPipe())

  if (process.env.STAGE !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('backend sample')
      .setDescription('The API description')
      .setVersion('1.0')
      .build()
    const document = SwaggerModule.createDocument(app, config)
    SwaggerModule.setup('openapi', app, document)
  }

  const corsOptions: CorsOptions = {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,POST,DELETE',
  };
  app.enableCors(corsOptions);

  await app.listen(Number(process.env.PORT) || 3001)
}
bootstrap()
