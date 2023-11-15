import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { User } from '@prisma/client';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserCode(user: User) {
    await this.mailerService.sendMail({
      to: user.email,
      subject: 'И-мэйл баталгаажуулах',
      template: 'confirmation',
      context: {
        name: user.firstName,
        email: user.email,
        link: 'https://api.mondaa.com.au/user/confirm/' + user.link,
        date: user.linkDate,
      },
    });
  }
}
