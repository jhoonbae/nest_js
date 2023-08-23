import { Module, MiddlewareConsumer, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import emailConfig from './config/emailConfig';
import { validationSchema } from './config/validationSchema';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerMiddleware } from './logger/logger.middleware';
import { Logger2Middleware } from './logger/logger2.middleware';
import { UsersController } from './users/users.controller';

@Module({
  imports: [
    UsersModule,
    ConfigModule.forRoot({
      envFilePath: [`${__dirname}/config/env/.${process.env.NODE_ENV}.env`],
      load: [emailConfig],
      isGlobal: true,
      validationSchema,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_HOST,
      port: 3307,
      username: process.env.DATABASE_USERNAME, 
      password: process.env.DATABASE_PASSWORD, 
      database: 'test',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: false,//process.env.DATABASE_SYNCHRONIZE === 'true',
      // migrationsRun : true,
      migrations: [__dirname + '/**/migrations/*.js'],
      migrationsTableName: 'migrations'
    })
  ],
  controllers: [],
  providers: [],
})

// 미들웨어를 거치는 AppModule 설정하기
// export class AppModule implements NestModule {
//   configure(consumer: MiddlewareConsumer) : any {
//     consumer
//     .apply(LoggerMiddleware, Logger2Middleware)
//     .exclude({ path: '/users/:id', method: RequestMethod.GET },) // path에 요청 주소 , method에 요청메소드를 입력하면 해당 요청은 미들웨어를 거치지 않는다.
//     .forRoutes(UsersController)
//   }  
// }

export class AppModule { }