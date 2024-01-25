import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class GroupUserService {
  constructor(
    private prismaService: PrismaService,
    private userService: UserService,
  ) {}

  async create(groupId: number, usersIds: number[]) {
    try {
      return this.prismaService.chatGroupUser.createMany({
        data: usersIds.map((userId) => {
          return { groupId, userId };
        }),
      });
    } catch (err) {
      Logger.log(err);
    }
  }

  async findAll(groupId: number) {
    try {
      const groupUsers = await this.prismaService.chatGroupUser.findMany({
        where: {
          groupId,
          status: 'InUse',
        },
        orderBy: {
          User: {
            firstName: 'asc',
          },
        },
      });

      return Promise.all(
        groupUsers.map(async (groupUser) => {
          return await this.userService.findOneById(groupUser.userId);
        }),
      );
    } catch (err) {
      Logger.log(err);
    }
  }

  async findOne(id: number) {
    return `This action returns a #${id} groupUser`;
  }

  async update(id: number) {
    return `This action updates a #${id} groupUser`;
  }

  async remove(id: number, user: any) {
    const sth = await this.prismaService.chatGroupUser.deleteMany({
      where: {
        groupId: id,
        userId: user.id,
      },
    });
    console.log(sth);
    return sth;
  }
}
