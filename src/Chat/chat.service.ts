import { Injectable, Logger } from '@nestjs/common';
import { EventsGateway } from 'src/events/events.gateway';
import { PrismaService } from 'src/services/prisma.service';
// import { UserService } from 'src/user/user.service';
// import { NotificationService } from 'src/services/notification.service';
// import { WorkHourService } from 'src/work-hour/work-hours.service';

@Injectable()
export class ChatService {
  constructor(
    private eventsGateway: EventsGateway,
    private prismaService: PrismaService,
  ) {}
  async getMessages(groupId: string, offset: string) {
    try {
      return await this.prismaService.message.findMany({
        where: {
          groupId: parseInt(groupId),
        },
        skip: parseInt(offset),
        take: 20,
        orderBy: {
          id: 'desc',
        },
      });
    } catch (error) {
      Logger.log(error);
      return {
        status: 400,
        body: error,
      };
    }
  }

  async sendMessage(message: {
    groupId: number;
    senderId: number;
    body: string;
  }) {
    try {
      const sth = await this.prismaService.message.create({
        data: {
          groupId: message.groupId,
          senderId: message.senderId,
          body: message.body,
        },
      });
      Logger.log(sth);
      return await this.eventsGateway.sendMessage(message);
    } catch (err) {
      console.log(err);
    }
  }
}
