import { Module } from '@nestjs/common';
import { PrismaService } from '../services/prisma.service';
import { WorkHourController } from './work-hours.controller';
import { NotificationService } from 'src/services/notification.service';
import { WorkHourService } from './work-hours.service';
import { UserModule } from 'src/user/user.module';
import { S3Service } from 'src/services/s3.service';

@Module({
  controllers: [WorkHourController],
  providers: [WorkHourService, PrismaService, S3Service, NotificationService],
  imports: [UserModule],
  exports: [WorkHourService],
})
export class WorkHourModule {}
