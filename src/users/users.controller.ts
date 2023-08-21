import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException, HttpCode, Redirect, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {UserLoginDTO} from './dto/user-login.dto';
import {VerifyEmailDTO} from './dto/verify-email.dto';
import {UserInfo} from './UserInfo';


@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getHello(): string {
    return process.env.DATABASE_HOST
  }

  @Post()
  async createUser(@Body() dto: CreateUserDto) : Promise<void> {

    console.log('dto :>> ', dto);
    const {email, name, password} = dto

    await this.usersService.createUser(name, email, password)
  }

  @Post('/email-verify')
  async verifyEmail(@Query() dto : VerifyEmailDTO) : Promise<string> {
    console.log('dto :>> ', dto);

    const {signupVerifyToken} = dto
    return await this.usersService.verifyEmail(signupVerifyToken)
  }

  @Post('/login')
  async login(@Body() dto : UserLoginDTO) : Promise<string> {
    console.log('dto :>> ', dto);
    const {email, password} = dto
    return await this.usersService.login(email, password)
  }

  @Get('/:id')
  async getUserInfo(@Param('id') userId : string) : Promise<UserInfo> {

    console.log('userId :>> ', userId);
    return await this.usersService.getUserInfo(userId)
  }

  // @Get()
  // findAll() {
  //   return this.usersService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   console.log("Get:id 요청 ")
  //   if(+id < 1) throw new BadRequestException("id 는 0보다 큰 값이여야 합니다.")
  //   return this.usersService.findOne(+id);
  // }

  // @HttpCode(202)
  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {

  //   return this.usersService.update(+id, updateUserDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.usersService.remove(+id);
  // }

  // @Get('redirect/docs')
  // @Redirect('https://docs.nestjs.com', 302)
  // getDocs(@Query('version') version) {
  //   if(version && version === '5') return { url : 'https://docs.nestjs.com/v5/'}
  // }
}
