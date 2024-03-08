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
    file?: string | [string],
    parentId = 1,
  ) {
    try {
      if (!isFolder) {
        if (Array.isArray(file)) {
          const firstOne = await this.create(
            isFolder,
            name,
            ownerId,
            file[0],
            parentId,
          );
          if (firstOne && 'id' in firstOne) {
            file.slice(1).map(async (fl, idx) => {
              await this.create(isFolder, name, ownerId, fl, firstOne.id);
              console.log(idx, 'done');
            });
          } else {
            console.error('ayul ayul. firstOne-d ID baihgui bshdee');
          }
          return firstOne;
        } else {
          const imageBuffer = Buffer.from(
            file.replace(/^data:image\/\w+;base64,/, ''),
            'base64',
          );

          const thumbnail = await sharp(imageBuffer)
            .resize({ width: 200 })
            .toBuffer();

          const base64Thumbnail = thumbnail.toString('base64');

          const FileURL = await this.s3Service.uploadFile('Files', file);
          const thumbnail_url = await this.s3Service.uploadFile(
            'Thumbnails',
            base64Thumbnail,
          );

          if (!thumbnail_url.success)
            return { status: 'Error', result: thumbnail_url };
          if (!FileURL.success) return { status: 'Error', result: FileURL };

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
        }
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
    } catch (e) {
      console.error(e);
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
          created_at: true,
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
      const ss = await this.prismaService.files.findMany({
        where: {
          parentId: id,
          status: 'InUse',
        },
      });
      console.log([sth].concat(ss));
      return [sth].concat(ss);
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
