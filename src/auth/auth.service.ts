import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { expires_in } from './constants';
import { NotificationService } from 'src/services/notification.service';
import { WorkHourService } from 'src/work-hour/work-hours.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private workHours: WorkHourService,
    private jwtTokenService: JwtService,
    private notificationService: NotificationService,
  ) {}

  async login(email: string, password: string) {
    const result = await this.usersService.findOne(email, password);
    if (result?.success) {
      const jwt = await this.jwtTokenService.sign(result.user);
      return {
        ...result,
        access_token: jwt,
        expires_in,
      };
    } else {
      return result;
    }
  }
  // async test(data) {
  //   const sth = await this.prisma.workHours.createMany({ data });
  //   console.log(sth);
  //   return sth;
  // }
}
