import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { PrismaService } from './../services/prisma.service';
import { User } from '@prisma/client';
import { ProjectUserService } from 'src/project-user/project-user.service';

@Injectable()
export class ProjectService {
  constructor(
    private prisma: PrismaService,
    @Inject(forwardRef(() => ProjectUserService))
    private projectUser: ProjectUserService,
  ) {}

  async create(data: {
    projectLocation: number;
    date: string;
    users: number[];
  }) {
    const project = await this.prisma.project.create({
      data: {
        date: data.date,
        projectLocationId: data.projectLocation,
      },
      select: {
        id: true,
        date: true,
        ProjectLocation: true,
      },
    });

    await this.projectUser.create({
      projectId: project.id,
      userIds: data.users,
    });

    return project;
  }

  findAll() {
    return this.prisma.project.findMany({
      where: {
        status: 'InUse',
      },
      orderBy: {
        updatedAt: 'desc',
      },
      select: {
        id: true,
        comment: true,
        date: true,
        updatedAt: true,
        _count: {
          select: {
            ProjectUsers: {
              where: {
                status: 'InUse',
              },
            },
          },
        },
      },
    });
  }

  async byDate(user: User, date: string) {
    let userFilter = {};
    if (user.role === 'Leader' || user.role === 'Employee') {
      userFilter = {
        ProjectUsers: {
          some: {
            userId: user.id,
            status: 'InUse',
          },
        },
      };
    }
    return await this.prisma.project.findMany({
      where: {
        status: 'InUse',
        date: {
          gte: `${date}T00:00:00Z`,
          lte: `${date}T23:59:59Z`,
        },
        ...userFilter,
      },
      orderBy: {
        updatedAt: 'desc',
      },
      select: {
        id: true,
        ProjectLocation: true,
        date: true,
        comment: true,
        updatedAt: true,
        ProjectUsers: {
          where: {
            status: 'InUse',
            User: {
              status: 'Verified',
            },
          },
        },
      },
    });
  }

  async findOne(id: number) {
    const sth = await this.prisma.project.findFirst({
      where: { id, status: 'InUse' },
      select: {
        id: true,
        date: true,
        comment: true,
        updatedAt: true,
        ProjectLocation: {
          select: {
            name: true,
          },
        },
        ProjectUsers: {
          where: {
            status: 'InUse',
            User: {
              status: 'Verified',
            },
          },
          select: {
            id: true,
            User: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                nickName: true,
                email: true,
                phone: true,
                avatar: true,
                role: true,
                emergencyEmail: true,
                emergencyName: true,
                emergencyPhone: true,
              },
            },
            workHours: true,
          },
        },
      },
    });
    return sth;
  }

  update(id: number, data: { projectLocationId: number }) {
    return this.prisma.project.update({
      where: { id },
      data,
      select: {
        id: true,
        updatedAt: true,
      },
    });
  }

  async remove(id: number) {
    const ProjectUsersz = await this.projectUser.getByProjectId(id);

    await this.projectUser.removeMany({
      projectId: id,
      projectUserIds: ProjectUsersz.map((user) => user.id),
    });

    return this.prisma.project.update({
      where: { id },
      data: {
        status: 'Deleted',
      },
    });
  }
}
