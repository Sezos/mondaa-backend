import { Module, forwardRef } from '@nestjs/common';
import { PrismaService } from './../services/prisma.service';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { ProjectUserModule } from 'src/project-user/project-user.module';

@Module({
  imports: [forwardRef(() => ProjectUserModule)],
  providers: [ProjectService, PrismaService],
  controllers: [ProjectController],
  exports: [ProjectService],
})
export class ProjectModule {}
