import { PrismaService } from '../services/prisma.service';
import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MailModule } from 'src/mail/mail.module';
import { S3Service } from 'src/services/s3.service';

@Module({
  imports: [MailModule],
  controllers: [UserController],
  providers: [UserService, PrismaService, S3Service],
  exports: [UserService],
})
export class UserModule {}
