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

  @Get('check')
  getUserInfo(@Request() request) {
    return request.user;
  }
}
