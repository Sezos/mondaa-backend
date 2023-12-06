import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { NotificationService } from 'src/services/notification.service';
import { EventsGateway } from 'src/events/events.gateway';
import { UserModule } from 'src/user/user.module';
import { PrismaService } from 'src/services/prisma.service';
import { GroupUserService } from 'src/group-user/group-user.service';

@Module({
  exports: [ChatService],
  imports: [UserModule],
  providers: [
    ChatService,
    EventsGateway,
    NotificationService,
    GroupUserService,
    PrismaService,
  ],
  controllers: [ChatController],
})
export class ChatModule {}
