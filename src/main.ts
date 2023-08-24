import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {WINSTON_MODULE_NEST_PROVIDER, WinstonModule, utilities as nestWinstonModuleUtilities} from 'nest-winston';
import * as winston from 'winston';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger : WinstonModule.createLogger({
      transports : [
        new winston.transports.Console({
          level : process.env.NODE_ENV === 'production' ? 'info' : 'silly',
          format : winston.format.combine(
            winston.format.timestamp(),
            nestWinstonModuleUtilities.format.nestLike('MyApp', {prettyPrint : true})
          )
        })
      ]
    })
  });
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
  }));
  // app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER))
  await app.listen(3000);
}
bootstrap();
