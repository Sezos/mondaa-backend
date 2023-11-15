import { NotificationService } from 'src/services/notification.service';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './auth/public.decorator';
import { Role } from './user/roles.decorator';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private notificationService: NotificationService,
  ) {}

  @Get()
  @Public()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('base')
  @Public()
  base() {
    return { s3_url: process.env.AWS_S3_URL };
  }

  @Post('sendNoti')
  @Role('Manager')
  sendNoti(@Body() body: { userIds: number[]; title: string; body: string }) {
    return this.notificationService.send(body.title, body.body, body.userIds);
  }

  @Post('sendNotiOff')
  @Role('Manager')
  sendNotiOff(@Body() body: { date: string }) {
    return this.notificationService.sendNotiOff(body.date);
  }
}
