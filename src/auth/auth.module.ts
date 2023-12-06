import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from 'src/user/user.module';
import { AuthService } from './auth.service';
import { jwtConstants } from './constants';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './auth.controller';
import { NotificationService } from 'src/services/notification.service';
import { WorkHourModule } from 'src/work-hour/work-hours.module';
import { GroupUserService } from 'src/group-user/group-user.service';
import { PrismaService } from 'src/services/prisma.service';

@Module({
  imports: [
    UserModule,
    PassportModule,
    WorkHourModule,
    JwtModule.register(jwtConstants),
  ],
  providers: [
    AuthService,
    JwtStrategy,
    NotificationService,
    GroupUserService,
    PrismaService,
  ],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
