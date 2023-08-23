import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { Logger3Middleware } from './logger/logger3.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 전역으로 설정하는 미들웨어
  // app.use(Logger3Middleware)

  app.useGlobalPipes(new ValidationPipe({
    transform : true
  }))
  await app.listen(3000);
  console.log('NODE_ENV :>> ', process.env[`DATABASE_HOST`]);
}
bootstrap();
