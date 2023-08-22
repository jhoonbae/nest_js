import {IsString, MinLength, MaxLength, IsEmail, Matches} from 'class-validator';
import {Transform} from 'class-transformer';
import {BadRequestException} from '@nestjs/common';
import { NotIn } from 'src/utils/decorators/not-in';

export class CreateUserDto {
    @IsString()
    @NotIn('password', { message: 'password는 name과 같은 문자열을 포함할 수 없습니다.' })
    @MinLength(1)
    @MaxLength(10)
    readonly name : string

    @Transform(({value, obj}) => {
        if(obj.password.includes(obj.name.trim())) throw new BadRequestException("비밀번호와 이름은 같은 문자를 포함할 수 없습니다.")
        return value.trim()
    })
    @IsString()
    @IsEmail({}, {message : "올바른 이메일 형식이 아닙니다."})
    @MaxLength(50)
    readonly email : string

    @IsString()
    @Matches(/^[A-Za-z\d!@#$%^&*()]{8,30}$/, {message : "비밀번호는 8자 이상 30자 미만의 숫자 대소문자 특수문자 가능합니다."})
    readonly password : string
}