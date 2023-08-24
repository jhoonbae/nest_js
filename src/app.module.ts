import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import authConfig from './config/authConfig';
import emailConfig from './config/emailConfig';
import { validationSchema } from './config/validationSchema';
import { UsersModule } from './users/users.module';
import * as winston from 'winston';
import {utilities as nestWinstonModuleUtils, WinstonModule} from 'nest-winston';

@Module({
  imports: [
    UsersModule,
    ConfigModule.forRoot({
      envFilePath: [`${__dirname}/config/env/.${process.env.NODE_ENV}.env`],
      load: [emailConfig, authConfig],
      isGlobal: true,
      validationSchema,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_HOST, // 'localhost',
      port: 3307,
      username: process.env.DATABASE_USERNAME, // 'root',
      password: process.env.DATABASE_PASSWORD, // 'test',
      database: 'test',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: false,
      migrations: [__dirname + '/**/migrations/*.js'],
      migrationsTableName: 'migrations',
    }),
    WinstonModule.forRoot({
      transports : [
        new winston.transports.Console({
          level : process.env.NODE_ENV === 'production' ? 'info' : 'silly',
          format : winston.format.combine(
            winston.format.timestamp(),
            nestWinstonModuleUtils.format.nestLike('MyApp', {prettyPrint : true})
          )
        })
      ]
    })
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }