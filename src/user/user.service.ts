import { UpdateUserDto } from './dto/update-user.dto';
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { MailService } from 'src/mail/mail.service';
import { S3Service } from 'src/services/s3.service';
import { PrismaService } from '../services/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from '@prisma/client';

function createLink() {
  const length = 26;
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
    private readonly s3Service: S3Service,
  ) {}
  saltOrRounds = 10;

  async confirm(link: string) {
    const check = await this.prisma.user.findFirst({
      where: {
        link: link,
      },
      select: {
        id: true,
        status: true,
      },
    });
    if (check) {
      await this.prisma.user.update({
        where: {
          id: check.id,
        },
        data: {
          link: null,
          linkDate: null,
          status: 'Verified',
        },
      });

      return 'https://android.mondaa.com.au/batalgaajulah';
    }

    return 'https://android.mondaa.com.au/amjiltgui';
  }

  async create(createUsersDto: CreateUserDto) {
    const check = await this.prisma.user.findFirst({
      where: {
        email: createUsersDto.email,
      },
      select: {
        id: true,
        status: true,
      },
    });

    if (check && check?.status === 'Verified') {
      return {
        success: false,
        message: 'Имэйл хаяг бүртэлтэй байна.',
      };
    }

    const hashedPassword: string = await bcrypt.hash(
      createUsersDto.password,
      this.saltOrRounds,
    );

    const link = createLink();

    if (check) {
      const user = await this.prisma.user.update({
        where: {
          id: check.id,
        },
        data: {
          firstName: createUsersDto.firstName,
          lastName: createUsersDto.lastName,
          password: hashedPassword,
          link,
          linkDate: new Date().toISOString(),
        },
      });
      await this.mailService.sendUserCode(user);
    } else {
      const user = await this.prisma.user.create({
        data: {
          firstName: createUsersDto.firstName,
          lastName: createUsersDto.lastName,
          nickName: createUsersDto.nickname,
          email: createUsersDto.email,
          password: hashedPassword,
          phone: createUsersDto.phone,
          address: createUsersDto.address,
          workABN: createUsersDto.workABN,
          workTFN: createUsersDto.workTFN,
          workVisaType: createUsersDto.workVisaType,
          rate: parseInt(createUsersDto.rate),
          emergencyName: createUsersDto.emergencyName,
          link: link,
          linkDate: new Date().toISOString(),
          emergencyEmail: createUsersDto.emergencyEmail,
          emergencyPhone: createUsersDto.emergencyPhone,
          experience: createUsersDto.experience,
          position: createUsersDto.position,
        },
      });

      console.log(user);

      await this.mailService.sendUserCode(user);
    }
    return {
      success: true,
      message: 'Амжилттай бүртгэгдлээ. Та и-мэйл хаягаа баталгаажуулна уу.',
    };
  }

  async forgotPassword(data: { email: string }) {
    const check = await this.prisma.user.findFirst({
      where: {
        email: data.email,
      },
      select: {
        id: true,
        status: true,
      },
    });

    const link = createLink();

    if (check) {
      const user = await this.prisma.user.update({
        where: {
          id: check.id,
        },
        data: {
          link,
          linkDate: new Date().toISOString(),
        },
      });

      await this.mailService.sendUserCode(user);

      return {
        success: true,
        message: 'Link илгээлээ. Та и-мэйл хаягаа шалгана уу.',
      };
    } else {
      return {
        success: true,
        message: 'И-мэйл хаяг бүртгэлгүй байна.',
      };
    }
  }

  async resetPassword(email: string, password?: string) {
    const check = await this.prisma.user.findFirst({
      where: {
        email,
      },
      select: {
        id: true,
        link: true,
      },
    });

    if (check) {
      if (check.link) {
        return {
          success: false,
          message: 'И-мэйл баталгаажаагүй байна.',
        };
      } else {
        if (password) {
          const hashedPassword: string = await bcrypt.hash(
            password,
            this.saltOrRounds,
          );

          await this.prisma.user.update({
            where: {
              id: check.id,
            },
            data: {
              password: hashedPassword,
            },
          });
        }
        return {
          success: true,
        };
      }
    }

    return {
      success: false,
      message: 'И-мэйл хаяг бүртгэлгүй байна.',
    };
  }

  async findOne(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        avatar: true,
        email: true,
        role: true,
        password: true,
        status: true,
        isReviewed: true,
        rate: true,
      },
    });

    if (!user) {
      console.log('email has not been registered. email: ', email);
      return {
        success: false,
        message: 'И-мэйл хаяг бүртгэлгүй байна.',
        user: null,
      };
    }

    if (user?.status === 'Pending') {
      return {
        success: false,
        message: 'И-мэйл хаяг баталгаажаагүй байна.',
        user: null,
      };
    }

    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        delete user.password;
        return {
          success: true,
          message: 'Амжилттай нэвтэрлээ.',
          user,
        };
      }
    }
    return {
      success: false,
      message: 'И-мэйл хаяг эсвэл нууц үг буруу байна.',
      user: null,
    };
  }
  async findOneById(id: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        avatar: true,
        email: true,
        role: true,
        password: true,
        status: true,
        isReviewed: true,
        rate: true,
      },
    });
    return user;
  }

  async roles() {
    return ['Leader', 'Employee'];
  }

  async statuses() {
    return ['Pending', 'Verified', 'Completed', 'Approved', 'Suspended'];
  }

  async employees() {
    return await this.prisma.user.findMany({
      where: {
        OR: [
          {
            role: 'Employee',
          },
          {
            role: 'Leader',
          },
        ],
        status: 'Verified',
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        nickName: true,
        avatar: true,
        status: true,
        isReviewed: true,
        email: true,
        phone: true,
        role: true,
        rate: true,
        employeeId: true,
      },
      orderBy: {
        firstName: 'asc',
      },
    });
  }

  async countEmployees() {
    const lol = await this.prisma.user.count({
      where: {
        OR: [
          {
            role: 'Employee',
          },
          {
            role: 'Leader',
          },
        ],
        status: 'Verified',
      },
    });
    return lol;
  }

  async all() {
    return await this.prisma.user.findMany({
      where: {
        role: { notIn: ['Admin', 'Manager'] },
        status: 'Verified',
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        nickName: true,
        avatar: true,
        email: true,
        phone: true,
        role: true,
        employeeId: true,
        status: true,
        isReviewed: true,
        fcmToken: true,
      },
      orderBy: {
        firstName: 'asc',
      },
    });
  }

  async findMany(query: any) {
    const sth = await this.prisma.user.findMany({
      where: query,
    });

    return sth;
  }

  async employeesByDate(date: string) {
    const users = await this.prisma.user.findMany({
      where: {
        OR: [
          {
            role: 'Employee',
          },
          {
            role: 'Leader',
          },
        ],
        status: 'Verified',
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        nickName: true,
        avatar: true,
        email: true,
        phone: true,
        role: true,
        employeeId: true,
        ProjectUsers: {
          where: {
            status: 'InUse',
            Project: {
              status: 'InUse',
              date: {
                gte: `${date}T00:00:00Z`,
                lte: `${date}T23:59:59Z`,
              },
            },
          },
          select: {
            id: true,
            Project: {
              select: {
                id: true,
                ProjectLocation: true,
              },
            },
          },
        },
      },
      orderBy: {
        firstName: 'asc',
      },
    });
    return users.filter((user) => user.ProjectUsers.length !== 0);
  }

  async employeesOff(date: string) {
    const users = await this.all();
    const usersWithJob = await this.employeesByDate(date);
    const noJobUsers = usersWithJob.map((usr) => usr.id);
    console.log(noJobUsers);
    const result = users.filter((user) => !noJobUsers.includes(user.id));

    return result;
  }

  async setRole(data: {
    id: number;
    role: 'Manager' | 'Leader' | 'Employee';
    employeeId: string;
  }) {
    return await this.prisma.user.update({
      where: {
        id: data.id,
      },
      data: {
        role: data.role,
        employeeId: data.employeeId,
      },
      select: {
        id: true,
        role: true,
      },
    });
  }

  async setStatus(data: { id: number; status: 'Approved' | 'Suspended' }) {
    return await this.prisma.user.update({
      where: {
        id: data.id,
        status: { in: ['Completed', 'Approved', 'Suspended'] },
      },
      data: {
        status: data.status,
      },
      select: {
        id: true,
        status: true,
      },
    });
  }

  async setFcm(user: User, token: string) {
    try {
      console.log(token);
      const sth = await this.prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          fcmToken: token,
        },
        select: {
          id: true,
          fcmToken: true,
        },
      });
      return sth;
    } catch (err) {
      console.log(err);
    }
  }

  async setAvatar(user: User, image: string) {
    const result = await this.s3Service.uploadFile('avatars', image);
    if (result.success) {
      if (user.avatar) {
        await this.s3Service.deleteFile(user.avatar);
      }
      await this.prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          avatar: result.response.Key,
        },
      });
      return { success: 1 };
    } else {
      return result;
    }
  }

  async uploadFile(user: User, image: string, type: string) {
    const result = await this.s3Service.uploadFile(type, image);
    if (result.success) {
      if (user[type]) {
        await this.s3Service.deleteFile(user[type]);
      }

      const res = await this.prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          [type]: result.response.Key,
        },
      });
      return res;
    } else {
      return result;
    }
  }

  async setWhiteCard(user: User, image: string) {
    const result = await this.s3Service.uploadFile('whiteCard', image);
    if (result.success) {
      if (user.workWhiteCard) {
        await this.s3Service.deleteFile(user.workWhiteCard);
      }
      await this.prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          workWhiteCard: result.response.Key,
        },
      });
      return this.checkUserComplete(user.id);
    } else {
      return result;
    }
  }

  getInfo(user: User) {
    return this.prisma.user.findFirst({
      where: {
        id: user.id,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        nickName: true,
        avatar: true,
        email: true,
        role: true,
        phone: true,
        address: true,
        status: true,
        isReviewed: true,
        emergencyPhone: true,
        rate: true,
        employeeId: true,
        PhotoID: true,
        PhotoIDBack: true,
        OtherCard: true,
        workWhiteCardBack: true,
        workWhiteCard: true,
        emergencyName: true,
        emergencyEmail: true,
        accountBSB: true,
        accountNumber: true,
        accountName: true,
        workABN: true,
        workVisaType: true,
        createdAt: true,
      },
    });
  }

  getInfo2(id: number) {
    return this.prisma.user.findFirst({
      where: { id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        nickName: true,
        employeeId: true,
        avatar: true,
        email: true,
        role: true,
        phone: true,
        address: true,
        status: true,
        isReviewed: true,
        emergencyPhone: true,
        emergencyName: true,
        emergencyEmail: true,
        accountBSB: true,
        accountNumber: true,
        accountName: true,
        workWhiteCard: true,
        workABN: true,
        workVisaType: true,
        createdAt: true,
      },
    });
  }

  async update(user: User, updateUserDto: UpdateUserDto) {
    let result = await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        ...updateUserDto,
      },
    });
    result = await this.checkUserComplete(user.id);
    return result;
  }

  async updateEmployee(id: string, updateUser: any) {
    const result = await this.prisma.user.update({
      where: {
        id: parseInt(id),
      },
      data: updateUser,
    });
    return result;
  }

  // async deleteEmployee(employeeEmail: string) {
  //   const result = await this.prisma.user.update({
  //     where: {
  //       email: employeeEmail,
  //     },
  //     data: {

  //     }
  //   });
  // }

  async checkUserComplete(id: number) {
    let result = await this.prisma.user.findFirst({
      where: { id },
    });
    if (
      result.firstName &&
      result.lastName &&
      result.nickName &&
      result.avatar &&
      result.phone &&
      result.address &&
      result.emergencyEmail &&
      result.emergencyName &&
      result.emergencyPhone &&
      result.accountBSB &&
      result.accountNumber &&
      result.accountName &&
      result.workABN &&
      result.workWhiteCard &&
      result.workVisaType
    ) {
      result = await this.prisma.user.update({
        where: { id, status: 'Verified' },
        data: {
          status: 'Completed',
        },
      });
    } else {
      result = await this.prisma.user.update({
        where: { id, status: 'Completed' },
        data: {
          status: 'Verified',
        },
      });
    }
    delete result.link;
    delete result.fcmToken;
    delete result.linkDate;
    delete result.password;
    return result;
  }
}
