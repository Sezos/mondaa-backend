import { Module, forwardRef } from '@nestjs/common';
import { PrismaService } from './../services/prisma.service';
import { ProjectUserController } from './project-user.controller';
import { ProjectUserService } from './project-user.service';
import { NotificationService } from 'src/services/notification.service';
import { UserModule } from 'src/user/user.module';
import { ProjectModule } from 'src/project/project.module';
import { GroupUserService } from 'src/group-user/group-user.service';

@Module({
  imports: [UserModule, forwardRef(() => ProjectModule)],
  controllers: [ProjectUserController],
  providers: [
    ProjectUserService,
    PrismaService,
    NotificationService,
    GroupUserService,
  ],
  exports: [ProjectUserService],
})
export class ProjectUserModule {}
