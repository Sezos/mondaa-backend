import { Injectable, Logger } from '@nestjs/common';
import { EventsGateway } from 'src/events/events.gateway';
import { NotificationService } from 'src/services/notification.service';
import { PrismaService } from 'src/services/prisma.service';

@Injectable()
export class ChatService {
  constructor(
    private eventsGateway: EventsGateway,
    private prismaService: PrismaService,
    private notificationService: NotificationService,
  ) {}
  async getMessages(groupId: string, offset: string) {
    try {
      return await this.prismaService.message.findMany({
        where: {
          groupId: parseInt(groupId),
        },
        select: {
          id: true,
          body: true,
          mediaURL: true,
          TimeStamp: true,
          senderId: true,
          groupId: true,
          Sender: {
            select: {
              id: true,
              firstName: true,
            },
          },
          Group: true,
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
      await this.prismaService.message.create({
        data: {
          groupId: message.groupId,
          senderId: message.senderId,
          body: message.body,
        },
      });
      const msg = await this.eventsGateway.sendMessage(message);
      this.notificationService.sendGroupUsers(
        message.senderId,
        message.body,
        message.groupId,
      );

      return {
        success: true,
        data: msg,
      };
    } catch (err) {
      return {
        success: false,
        message:
          'There was something wrong with the server. Please try again later',
      };
    }
  }
}
