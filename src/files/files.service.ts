import { S3Service } from './../services/s3.service';
import { PrismaService } from 'src/services/prisma.service';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class FilesService {
  constructor(
    private prismaService: PrismaService,
    private s3Service: S3Service,
  ) {}

  async create(
    isFolder: boolean,
    name: string,
    ownerId: number,
    file?: string,
    parentId = 1,
  ) {
    if (!name || !ownerId) {
      return {
        status: 'Error',
        message: 'Please Provide Name',
      };
    }
    if (!isFolder && !file) {
      return {
        status: 'Error',
        message: 'Please Provide File',
      };
    }
    if (!isFolder) {
      const FileURL = await this.s3Service.uploadFile('Files', file);
      if (!FileURL.success) return FileURL;
      if (!FileURL.success) return FileURL;
      return this.prismaService.files.create({
        data: {
          isFolder,
          name,
          ownerId,
          parentId,
          url: FileURL.response.Key,
        },
      });
    } else {
      return this.prismaService.files.create({
        data: {
          isFolder,
          name,
          ownerId,
          parentId,
        },
      });
    }
  }

  async findAll(parentId = 1) {
    try {
      return await this.prismaService.files.findMany({
        where: {
          parentId,
          status: 'InUse',
        },
        select: {
          id: true,
          thumbnail_url: true,
          name: true,
          isFolder: true,
          url: true,
        },
      });
    } catch (err) {
      Logger.error(err);
    }
  }

  async findOne(id: number) {
    try {
      const sth = await this.prismaService.files.findFirst({
        where: {
          id,
          status: 'InUse',
        },
      });
      console.log(sth);
      return sth;
    } catch (err) {
      Logger.error(err);
    }
  }

  async checked(ids: number[]) {
    try {
      return await this.prismaService.files.updateMany({
        where: {
          id: { in: ids },
        },
        data: {
          isChecked: true,
        },
      });
    } catch (err) {
      Logger.error(err);
    }
  }

  async remove(id: number) {
    try {
      return await this.prismaService.files.updateMany({
        where: {
          OR: [{ id: id }, { parentId: id }],
        },
        data: {
          status: 'Deleted',
        },
      });
    } catch (err) {
      Logger.error(err);
    }
  }
}
