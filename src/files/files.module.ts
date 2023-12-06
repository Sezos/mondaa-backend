import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { PrismaService } from 'src/services/prisma.service';
import { S3Service } from 'src/services/s3.service';

@Module({
  controllers: [FilesController],
  providers: [FilesService, PrismaService, S3Service],
})
export class FilesModule {}
