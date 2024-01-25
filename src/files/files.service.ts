import { S3Service } from './../services/s3.service';
import { PrismaService } from 'src/services/prisma.service';
import { Injectable, Logger } from '@nestjs/common';
import * as sharp from 'sharp';

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
    console.log('herea1');
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
      console.log('herea2');
      const imageBuffer = Buffer.from(
        file.replace(/^data:image\/\w+;base64,/, ''),
        'base64',
      );
      console.log('herea2a');

      const thumbnail = await sharp(imageBuffer)
        .resize({ width: 200 })
        .toBuffer();
      console.log('herea2b');

      const base64Thumbnail = thumbnail.toString('base64');
      console.log('herea2c');

      const FileURL = await this.s3Service.uploadFile('Files', file);
      const thumbnail_url = await this.s3Service.uploadFile(
        'Thumbnails',
        base64Thumbnail,
      );
      if (!thumbnail_url.success) return thumbnail_url;
      if (!FileURL.success) return FileURL;
      console.log('herea3');

      return this.prismaService.files.create({
        data: {
          isFolder,
          name,
          ownerId,
          parentId,
          url: FileURL.response.Key,
          thumbnail_url: thumbnail_url.response.Key,
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
          isChecked: true,
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

  async checkOne(id: number) {
    try {
      const data = await this.prismaService.files.findFirst({
        where: {
          id,
        },
      });
      return await this.prismaService.files.update({
        where: {
          id: id,
        },
        data: {
          isChecked: !data.isChecked,
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
