import { Body, Controller, Post, Get, Query, Request } from '@nestjs/common';
import { NotificationService } from 'src/services/notification.service';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(
    private chatService: ChatService,
    private notificationService: NotificationService,
  ) {}

  @Post('/')
  send(
    @Request()
    request,
    @Body()
    body: {
      body: string;
      groupId: string;
    },
  ) {
    return this.chatService.sendMessage({
      body: body.body,
      groupId: parseInt(body.groupId),
      senderId: parseInt(request.user.id),
    });
  }

  @Get('/')
  getMessages(
    @Query()
    query: {
      groupId: string;
      offset: string;
    },
  ) {
    return this.chatService.getMessages(query.groupId, query.offset);
  }
}
