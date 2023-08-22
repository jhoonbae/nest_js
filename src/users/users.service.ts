import { Injectable, UnprocessableEntityException, InternalServerErrorException } from '@nestjs/common';
import * as uuid from 'uuid';
import { ulid } from 'ulid';
import { EmailService } from 'src/email/email.service';
import { UserInfo } from './UserInfo';
import { UserEntity } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    private emailService : EmailService,
    @InjectRepository(UserEntity) private userRepository : Repository<UserEntity>,
    private dataSource : DataSource
  ) {}

  async createUser(name : string, email : string, password : string) {

    const userExist = await this.checkUserExists(email)
    console.log('userExist :>> ', userExist);
    if(userExist) throw new UnprocessableEntityException('중복된 이메일로는 가입할 수 없습니다.')

    const signupVerifyToken = uuid.v1()

    // await this.saveUser(name, email, password, signupVerifyToken)
    // await this.saveUserUsingQueryRunner(name, email, password, signupVerifyToken)
    await this.saveUserUsingTransaction(name, email, password, signupVerifyToken)

    // await this.sendMemberJoinEmail(email, signupVerifyToken)
    return ``
  }
  
  private async checkUserExists(emailAddress : string) {
    const user = await this.userRepository.findOne({where : {email : emailAddress}})
    
    return user === null ? false : true
  }
  
  private async saveUser(name : string, email : string, password : string, signupVerifyToken : string) {
    const user = new UserEntity()
    user.id = ulid()
    user.name = name
    user.email = email
    user.password = password
    user.signupVerifyToken = signupVerifyToken
    await this.userRepository.save(user)
    return 
  }

  private async saveUserUsingTransaction(name: string, email: string, password: string, signupVerifyToken: string) {
    await this.dataSource.transaction(async manager => {
      const user = new UserEntity();
      user.id = ulid();
      user.name = name;
      user.email = email;
      user.password = password;
      user.signupVerifyToken = signupVerifyToken;

      await manager.save(user);

      // throw new InternalServerErrorException();
    })
  }

  private async saveUserUsingQueryRunner(name: string, email: string, password: string, signupVerifyToken: string) {
    const queryRunner = this.dataSource.createQueryRunner(); // DataSource에서 QueryRunner를 생성

    await queryRunner.connect(); 
    await queryRunner.startTransaction();
    //QueryRunner에서 DB연결 후 트랜잭션 시작.

    try {
      const user = new UserEntity();
      user.id = ulid();
      user.name = name;
      user.email = email;
      user.password = password;
      user.signupVerifyToken = signupVerifyToken;

      await queryRunner.manager.save(user); // 정상동작을 수행했다면 트랜잭션을 커밋하여 영속화

      // throw new InternalServerErrorException(); // 일부러 에러를 발생시켜 본다

      await queryRunner.commitTransaction(); // db작업 수행 후 커밋하여 영속화 완료
    } catch (error) {
      // 에러가 발생하면 롤백
      console.log("error ! !", error)
      await queryRunner.rollbackTransaction(); // 오류발생시 롤백
    } finally {
      // 직접 생성한 QueryRunner는 해제시켜 주어야 함
      await queryRunner.release();
    }
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
