import { S3Service } from 'src/services/s3.service';
import { PrismaService } from 'src/services/prisma.service';
import { Injectable } from '@nestjs/common';
import { NotificationService } from 'src/services/notification.service';
import { UserService } from 'src/user/user.service';
import * as excel from 'exceljs';

@Injectable()
export class WorkHourService {
  constructor(
    private prisma: PrismaService,
    public userService: UserService,
    public s3service: S3Service,
    private notificationService: NotificationService,
  ) {}

  async get(query: any, selection: any) {
    return this.prisma.workHours.findMany({
      where: query,
      select: selection,
    });
  }

  async add(data: { userId: number; projectId: number; hours: number }) {
    const user = await this.userService.findOneById(data.userId);
    if (!user) return { status: 'error' };
    return this.prisma.workHours.create({
      data: {
        ...data,
        rate: user.rate,
      },
    });
  }
  // async update() {
  //   const users = await this.userService.employees();
  //   users.map(async (user) => {
  //     const wokrs = await this.prisma.workHours.findMany({
  //       where: { userId: user.id },
  //     });

  //     const ids = wokrs.map((id) => id.id);
  //     console.log(user.id, ids);
  //     await this.prisma.workHours.updateMany({
  //       where: { id: { in: ids } },
  //       data: {
  //         rate: user.rate,
  //       },
  //     });
  //   });
  // }

  async remove(id: number) {
    return this.prisma.workHours.delete({
      where: {
        id,
      },
    });
  }

  async getTotal(query: any) {
    if (query.employeeId <= 0) delete query.employeeId;
    const employees = await this.userService.employees();
    const datas = await this.prisma.workHours.findMany({
      where: {
        ...(query.employeeId ? { userId: parseInt(query.employeeId) } : {}),
        Project: {
          ProjectLocation: {
            ...(query.projectLocationId
              ? { id: parseInt(query.projectLocationId) }
              : {}),
          },
          date: {
            gte: `${query.from}T00:00:00Z`,
            lte: `${query.to}T23:59:59Z`,
          },
        },
      },
      select: {
        id: true,
        hours: true,
        rate: true,
        User: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            rate: true,
            isGST: true,
            employeeId: true,
          },
        },
        Project: {
          select: {
            ProjectLocation: {
              select: {
                name: true,
                id: true,
                location: true,
              },
            },
          },
        },
      },
    });

    const employeeIds = employees.map((employee) => {
      return { id: employee.id, employeeId: employee.employeeId };
    });

    const result = [];

    employeeIds.forEach((employeeId) => {
      const workHours = datas.filter((data) => data.User.id === employeeId.id);

      if (workHours && workHours.length !== 0) {
        const total = {
          employeeId: employeeId.employeeId,
          rate: workHours[0].rate || 0,
          isGST: workHours[0].User.isGST || 0,
          User: workHours[0].User,
          Project: workHours[0].Project,
          workHours: 0,
          total: 0,
          salary: '',
        };

        workHours.forEach((workHour) => {
          total.total += workHour.hours * workHour.rate;
          total.workHours += workHour.hours;
        });

        total.salary = (total.total * (total.isGST ? 1.1 : 1)).toFixed();

        result.push(total);
      }
    });

    return result;
  }

  async getTotalEmployee(query: any) {
    const datas = await this.prisma.workHours.findMany({
      where: {
        Project: {
          date: {
            gte: `${query.from}T00:00:00Z`,
            lte: `${query.to}T23:59:59Z`,
          },
        },
        User: {
          id: parseInt(query.employeeId),
        },
      },
      select: {
        id: true,
        hours: true,
        rate: true,
        User: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            rate: true,
            isGST: true,
            employeeId: true,
          },
        },
        Project: {
          select: {
            date: true,
            ProjectLocation: true,
          },
        },
      },
    });

    return datas.map((data) => {
      data['salary'] = (
        data.hours *
        data.rate *
        (data.User.isGST ? 1.1 : 1)
      ).toFixed();
      return data;
    });
  }

  async createExcel(
    headers: Partial<excel.Column>[],
    rows: any[],
    from: string,
    to: string,
  ): Promise<Buffer> {
    const workbook: excel.stream.xlsx.WorkbookWriter =
      new excel.stream.xlsx.WorkbookWriter({});
    const sheet: excel.Worksheet = workbook.addWorksheet('My Worksheet');
    sheet.columns = headers;
    let sum = 0.0;
    for (let i = 0; i < rows.length; i++) {
      sheet.addRow(rows[i]);
      sum += parseFloat(rows[i]['salary']);
    }
    sheet.addRow(['from: ', from, 'to:', to, '', 'Total: ', sum]);
    sheet.commit();
    return new Promise((resolve, reject): void => {
      workbook
        .commit()
        .then(() => {
          const stream: any = (workbook as any).stream;
          const result: Buffer = stream.read();
          resolve(result);
        })
        .catch((e) => {
          reject(e);
        });
    });
  }

  async downloadWorkHours(query: any) {
    if (query.employeeId) {
    }
    let data = await this.getTotal(query);
    data = data.map((dat) => {
      return {
        id: dat.employeeId,
        rate: dat.rate,
        isGST: dat.isGST,
        firstName: dat.User.firstName,
        lastName: dat.User.lastName,
        workHours: dat.workHours,
        salary: dat.salary,
      };
    });

    const stream = await this.createExcel(
      [
        { header: 'Employee ID', key: 'id' },
        { header: 'First Name', key: 'firstName' },
        { header: 'Last Name', key: 'lastName' },
        { header: 'rate', key: 'rate' },
        { header: 'Work Hours', key: 'workHours' },
        { header: 'isGST', key: 'isGST' },
        { header: 'salary', key: 'salary' },
      ],
      data,
      query.from,
      query.to,
    );

    const name = `Salary_${query.from}_${query.to}.xlsx`;
    const result = await this.s3service.uploadXLSX(stream, name);
    return result;
  }
}
