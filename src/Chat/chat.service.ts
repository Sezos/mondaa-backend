import { Injectable, Logger } from '@nestjs/common';
import { Message } from '@prisma/client';
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

  async sendMessage(message: Message) {
    const sth = await this.prismaService.message.create({ data: message });
    Logger.log(sth);
    return await this.eventsGateway.sendMessage(message);
  }
}
