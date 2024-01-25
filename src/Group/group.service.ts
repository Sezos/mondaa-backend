import { S3Service } from 'src/services/s3.service';
import { PrismaService } from './../services/prisma.service';
import { Injectable, Logger } from '@nestjs/common';
import { User } from '@prisma/client';

@Injectable()
export class GroupService {
  constructor(
    private prismaService: PrismaService,
    private s3Service: S3Service,
  ) {}
  async create(name: string, users: number[], creater: User) {
    try {
      const group = await this.prismaService.chatGroups.create({
        data: {
          name,
        },
      });
      const GroupUsers = await this.prismaService.chatGroupUser.createMany({
        data: users.map((id) => {
          return { groupId: group.id, userId: id, isAdmin: id === creater.id };
        }),
      });
      return {
        group,
        users: GroupUsers,
      };
    } catch (err) {
      return {
        status: 'Error',
        message: 'Something is not working',
      };
    }
  }

  async findAll(user: User) {
    if (user.role === 'Manager') {
      const group = await this.prismaService.chatGroups.findMany();
      const result = await Promise.all(
        group.map(async (grp) => {
          const lastMessage = await this.prismaService.message.findFirst({
            where: {
              groupId: grp.id,
            },
            orderBy: {
              id: 'desc',
            },
          });
          return {
            ...grp,
            message: lastMessage,
          };
        }),
      );
      return result;
    } else {
      const groupUsers = await this.prismaService.chatGroupUser.findMany({
        where: {
          userId: user.id,
          status: 'InUse',
        },
      });
      const group = await this.prismaService.chatGroups.findMany({
        where: {
          id: {
            in: groupUsers.map((grpUser) => grpUser.groupId),
          },
        },
      });
      const result = await Promise.all(
        group.map(async (grp) => {
          const lastMessage = await this.prismaService.message.findFirst({
            where: {
              groupId: grp.id,
            },
            orderBy: {
              id: 'desc',
            },
          });
          return {
            ...grp,
            message: lastMessage,
          };
        }),
      );
      return result;
    }
  }

  async findOne(id: number) {
    return await this.prismaService.chatGroups.findFirst({ where: { id } });
  }

  async update(
    id: number,
    name?: string,
    addUserIds?: number[],
    removeUserIds?: number[],
  ) {
    try {
      if (name) {
        await this.prismaService.chatGroups.update({
          where: {
            id,
          },
          data: {
            name,
          },
        });
      }
      if (addUserIds) {
        const data = addUserIds.map((userId) => {
          return {
            groupId: id,
            userId,
          };
        });
        await this.prismaService.chatGroupUser.createMany({
          data,
        });
      }
      if (removeUserIds) {
        await this.prismaService.chatGroupUser.updateMany({
          where: { groupId: id, userId: { in: removeUserIds } },
          data: {
            status: 'Deleted',
          },
        });
      }
      if (removeUserIds || addUserIds) {
        const groupUsers = await this.prismaService.chatGroupUser.findMany({
          where: {
            groupId: id,
            status: 'InUse',
          },
          select: {
            User: true,
          },
          orderBy: {
            User: {
              firstName: 'asc',
            },
          },
        });

        const users = groupUsers.map((user) => user.User);
        return {
          success: true,
          message: 'Group Chat has been updated successfully',
          employees: users,
        };
      } else
        return {
          success: true,
          message: 'Group Chat has been updated successfully',
        };
    } catch (error) {
      return {
        success: false,
        message: 'Something went wrong while updating group',
      };
    }
  }

  async setImage(groupId: number, image: string) {
    const result = await this.s3Service.uploadFile('groupImage', image);

    const group = await this.prismaService.chatGroups.findFirst({
      where: {
        id: groupId,
      },
    });

    if (result.success) {
      if (group.imgURL) {
        await this.s3Service.deleteFile(group.imgURL);
      }

      await this.prismaService.chatGroups.update({
        where: {
          id: groupId,
        },
        data: {
          imgURL: result.response.Key,
        },
      });

      return {
        success: true,
        message: 'Group Image has been uploaded successfully',
        url: result.response.Key,
      };
    } else {
      return result;
    }
  }
  remove(id: number) {
    try {
      return this.prismaService.chatGroups.update({
        where: {
          id,
        },
        data: {
          status: 'Deleted',
        },
      });
    } catch (error) {
      Logger.log(error);
      return {
        success: false,
        message: 'Unsuccessful',
        error: error,
      };
    }
  }
}
