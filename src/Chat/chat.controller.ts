import { Body, Controller, Post } from '@nestjs/common';
import { NotificationService } from 'src/services/notification.service';
import { ChatService } from './chat.service';
import { Message } from '@prisma/client';

@Controller('chat')
export class ChatController {
  constructor(
    private chatService: ChatService,
    private notificationService: NotificationService,
  ) {}

  @Post('sendMessage')
  send(
    @Body()
    body: Message,
  ) {
    return this.chatService.sendMessage(body);
  }
}
