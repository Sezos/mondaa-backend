import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './public.decorator';
import { NotificationService } from 'src/services/notification.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private notificationService: NotificationService,
  ) {}

  @Post('login')
  @Public()
  login(
    @Body()
    { email, password }: { email: string; password: string },
  ) {
    return this.authService.login(email, password);
  }

  // @Post('test')
  // @Public()
  // test(@Body() body: { title: string; body: string; userIds: [] }) {
  //   return this.notificationService.send(body.title, body.body, body.userIds);
  // }

  @Get('check')
  getUserInfo(@Request() request) {
    return request.user;
  }
}
