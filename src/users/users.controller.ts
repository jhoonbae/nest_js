import { Body, Controller, Get, Param, Post, Query, Headers, UseGuards, Inject, InternalServerErrorException, Logger, LoggerService } from '@nestjs/common';
import { AuthGuard } from 'src/auth.guard';
import { AuthService } from 'src/auth/auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { UserInfo } from './UserInfo';
import { UsersService } from './users.service';
import {Logger as WinstonLogger} from 'winston';
import {WINSTON_MODULE_PROVIDER} from 'nest-winston';

@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
    // @Inject(WINSTON_MODULE_PROVIDER) private readonly logger : WinstonLogger,
    @Inject(Logger) private readonly logger : LoggerService
  ) { }

  @Post()
  async createUser(@Body() dto: CreateUserDto): Promise<void> {
    this.printLoggerServiceLog(dto)

    const { name, email, password } = dto;

    await this.usersService.createUser(name, email, password);
    return

  }
  private printLoggerServiceLog(dto : any) {
    try {
      throw new InternalServerErrorException('test')
    } catch (error) {
      this.logger.error('error', JSON.stringify(dto), error.stack)
    }
    this.logger.warn('warn', JSON.stringify(dto))
    this.logger.log('log',JSON.stringify(dto))
    this.logger.verbose('verbose', JSON.stringify(dto))
    this.logger.debug('debug', JSON.stringify(dto))
  }

  @Post('/email-verify')
  async verifyEmail(@Query() dto: VerifyEmailDto): Promise<string> {
    const { signupVerifyToken } = dto;

    return await this.usersService.verifyEmail(signupVerifyToken);
  }

  @Post('/login')
  async login(@Body() dto: UserLoginDto): Promise<string> {
    const { email, password } = dto;

    return await this.usersService.login(email, password);
  }

  // @Get(':id')
  // async getUserInfo(@Headers() headers: any, @Param('id') userId: string): Promise<UserInfo> {
  //   const jwtString = headers.authorization.split('Bearer ')[1];

  //   this.authService.verify(jwtString);

  //   return this.usersService.getUserInfo(userId);
  // }

  @UseGuards(AuthGuard)
  @Get(':id')
  async getUserInfo(@Headers() headers: any, @Param('id') userId: string): Promise<UserInfo> {
    
    return this.usersService.getUserInfo(userId);
  }
}
