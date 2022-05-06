import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({

    // remove the element that not define in DTO
    whitelist: true,
  }
  ));
  await app.listen(3000);
}
bootstrap();