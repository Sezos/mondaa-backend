import { Module, forwardRef } from '@nestjs/common';
import { PrismaService } from './../services/prisma.service';
import { ProjectUserController } from './project-user.controller';
import { ProjectUserService } from './project-user.service';
import { NotificationService } from 'src/services/notification.service';
import { UserModule } from 'src/user/user.module';
import { ProjectModule } from 'src/project/project.module';

@Module({
  imports: [UserModule, forwardRef(() => ProjectModule)],
  controllers: [ProjectUserController],
  providers: [ProjectUserService, PrismaService, NotificationService],
  exports: [ProjectUserService],
})
export class ProjectUserModule {}
