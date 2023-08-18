import { Injectable } from '@nestjs/common';
import * as uuid from 'uuid';
import { EmailService } from 'src/email/email.service';
import { UserInfo } from './UserInfo';

@Injectable()
export class UsersService {
  constructor(private emailService : EmailService) {}

  async createUser(name : string, email : string, password : string) {

    await this.checkUserExists(email)

    const signupVerifyToken = uuid.v1()

    await this.saveUser(name, email, password, signupVerifyToken)
    
    await this.sendMemberJoinEmail(email, signupVerifyToken)
    return ``
  }
  
  private checkUserExists(email : string) {
    return false 
    // DB 연동 후 추후 구현
  }
  
  private saveUser(name : string, email : string, password : string, signupVerifyToken : string) {
    return // DB 연동 후 구현
  }

  private async sendMemberJoinEmail(email : string, signupVerifyToken : string) {
    await this.emailService.sendMemberJoinVerification(email, signupVerifyToken)
  }

  async verifyEmail(signupVerifyToken : string) : Promise<string> {
    // TODO
    // 1. DB에서 해당토큰으로 회원가입처리중인 유저 있는지 조회 후 없다면 에러처리
    // 2. 바로 로그인 상태가 되도록 jwt 발급
    throw new Error("메소드 미구현 상태.")
  }

  async login(email : string, password : string) : Promise<string> {
    // TODO
    // 1. 해당 정보의 회원 정보 존재하는지 확인 후 없다면 에러ㅓㅊ리
    // 2. JWT발급
    throw new Error("메소드 미구현 상태.")
  }

  async getUserInfo(userId : string) : Promise<UserInfo>{
    // TODO
    // 1. id 가진 유저 존재 확인 후 없다면 에러처리
    // 2. 조회된 데이터를 userinfo 타입으로 응답
    throw new Error("메소드 미구현 상태.")
  }
}
