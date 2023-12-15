import { Module } from '@nestjs/common';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';
import { PrismaService } from 'src/services/prisma.service';
import { S3Service } from 'src/services/s3.service';

@Module({
  controllers: [GroupController],
  providers: [GroupService, PrismaService, S3Service],
})
export class GroupModule {}
