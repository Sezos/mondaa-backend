import { Module } from '@nestjs/common';
import { PrismaService } from '../services/prisma.service';
import { ProjectLocationController } from './projectLocation.controller';
import ProjectLocationService from './projectLocation.service';

@Module({
  providers: [ProjectLocationService, PrismaService],
  controllers: [ProjectLocationController],
})
export class ProjectLocationModule {}
