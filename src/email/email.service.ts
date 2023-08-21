import { Injectable, Inject } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import Mail = require('nodemailer/lib/mailer');
import emailConfig from 'src/config/emailConfig';

interface EmailOptions {
    to : string
    subject : string
    html : string
}

@Injectable()
export class EmailService {
    private transporter : Mail
    constructor(
        @Inject(emailConfig.KEY) private config: ConfigType<typeof emailConfig>,
      ) {
        this.transporter = nodemailer.createTransport({
          service: config.service,
          auth: {
            user: config.auth.user,
            pass: config.auth.pass,
          }
        });
      }
    
    async sendMemberJoinVerification(emailAdderss : string, signupVerifyToken : string) {
        console.log('emailAdderss :>> ', emailAdderss);
        console.log('signupVerifyToken :>> ', signupVerifyToken);
        const baseUrl = process.env.BASE_URL

        const url = `${baseUrl}/users/email-verify?signupVerifyToken=${signupVerifyToken}`

        console.log('url :>> ', url);

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
