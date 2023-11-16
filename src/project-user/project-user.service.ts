import { PrismaService } from 'src/services/prisma.service';
import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { NotificationService } from 'src/services/notification.service';
import { ProjectService } from 'src/project/project.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class ProjectUserService {
  constructor(
    private prisma: PrismaService,
    @Inject(forwardRef(() => ProjectService))
    private projectService: ProjectService,
    private notificationService: NotificationService,
    private userService: UserService,
  ) {}

  async create(data: { projectId: number; userIds: number[] }) {
    const project = await this.projectService.findOne(data.projectId);
    const users = await this.userService.findMany({ id: { in: data.userIds } });
    const datas = [];

    users.map((u) => {
      datas.push({
        projectId: data.projectId,
        userId: u.id,
      });
    });

    const projectUser = this.prisma.projectUser.createMany({
      data: datas,
    });

    this.notificationService.send(
      'You have new Job',
      `You have new Job at ${project.ProjectLocation.name}`,
      data.userIds,
    );

    return projectUser;
  }

  getByProjectId(ProjectId: number) {
    return this.prisma.projectUser.findMany({
      where: {
        projectId: ProjectId,
      },
      select: {
        id: true,
        Project: true,
        User: true,
      },
    });
  }

  async removeMany(data: { projectUserIds: number[]; projectId: number }) {
    return await this.prisma.projectUser.updateMany({
      where: {
        projectId: data.projectId,
        userId: { in: data.projectUserIds },
      },
      data: {
        status: 'Deleted',
      },
    });
  }

  async getMany({ from, to }) {
    return await this.prisma.projectUser.findMany({
      where: {
        Project: {
          date: {
            gte: `${from}T00:00:00Z`,
            lte: `${to}T23:59:59Z`,
          },
          status: 'InUse',
        },
        status: 'InUse',
      },
      select: {
        id: true,
        Project: true,
        User: true,
      },
    });
  }

  async count({ from, to }) {
    return await this.prisma.projectUser.count({
      where: {
        Project: {
          date: {
            gte: `${from}T00:00:00Z`,
            lte: `${to}T23:59:59Z`,
          },
          status: 'InUse',
        },
        status: 'InUse',
      },
    });
  }
}
