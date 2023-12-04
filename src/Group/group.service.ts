import { PrismaService } from './../services/prisma.service';
import { Injectable, Logger } from '@nestjs/common';
import { User } from '@prisma/client';

@Injectable()
export class GroupService {
  constructor(private prismaService: PrismaService) {}
  async create(name: string, users: number[]) {
    try {
      const group = await this.prismaService.chatGroups.create({
        data: {
          name,
        },
      });
      const GroupUsers = await this.prismaService.chatGroupUser.createMany({
        data: users.map((id) => {
          return { groupId: group.id, userId: id };
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
      console.log(group);
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
      console.log(result);
      return result;
    } else {
      const groupUsers = await this.prismaService.chatGroupUser.findMany({
        where: {
          userId: user.id,
        },
      });
      return await this.prismaService.chatGroups.findMany({
        where: {
          id: {
            in: groupUsers.map((grpUser) => grpUser.groupId),
          },
        },
      });
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} group`;
  }

  update(id: number) {
    return `This action updates a #${id} group`;
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
    }
  }
}
