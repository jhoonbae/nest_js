import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import Mail = require('nodemailer/lib/mailer');

interface EmailOptions {
    to : string
    subject : string
    html : string
}

@Injectable()
export class EmailService {
    private transporter : Mail
    constructor() {
        this.transporter = nodemailer.createTransport({
            service : 'gmail',
            auth : {
                user : 'bae960648@gmail.com',
                pass : 'pooiehiycmvmprcy'
            }
        })
    }
    
    async sendMemberJoinVerification(emailAdderss : string, signupVerifyToken : string) {
        console.log('emailAdderss :>> ', emailAdderss);
        console.log('signupVerifyToken :>> ', signupVerifyToken);
        const baseUrl = 'http://localhost:3000'

        const url = `${baseUrl}/users/email-verify?signupVerifyToken=${signupVerifyToken}`

        const mailOptions : EmailOptions = {
            to : emailAdderss,
            subject : '가입 인증 메일',
            html : `
                가입확인 버튼을 누르면 가입 인증 완료. <br/>
                <form action="${url}" method="POST">
                <button>가입 확인</button>
                <form/>`
        }
        return await this.transporter.sendMail(mailOptions)
    }

}
