import { Injectable } from '@nestjs/common';
import { PrismaService } from '../services/prisma.service';
// import { User } from '@prisma/client';

@Injectable()
export default class ProjectLocationService {
  constructor(private prisma: PrismaService) {}

  async create(data: { name: string; formanId?: number; address: string }) {
    const project = await this.prisma.projectLocation.create({
      data: {
        name: data.name,
        formanId: data.formanId,
        location: data.address,
      },
    });

    return project;
  }

  async findAll() {
    return await this.prisma.projectLocation.findMany({
      where: {
        status: 'InUse',
      },
      orderBy: {
        updatedAt: 'desc',
      },
      select: {
        id: true,
        name: true,
        location: true,
        Forman: true,
        updatedAt: true,
      },
    });
  }

  findOne(id: number) {
    return this.prisma.projectLocation.findFirst({
      where: { id, status: 'InUse' },
      select: {
        id: true,
        name: true,
        location: true,
        Forman: {
          select: {
            id: true,
            firstName: true,
            email: true,
            role: true,
          },
        },
        updatedAt: true,
      },
    });
  }

  update(id: number, data: { name: string }) {
    return this.prisma.projectLocation.update({
      where: { id },
      data,
      select: {
        id: true,
        name: true,
        updatedAt: true,
      },
    });
  }

  remove(id: number) {
    return this.prisma.projectLocation.update({
      where: { id },
      data: {
        status: 'Deleted',
      },
    });
  }
}
