import { Logger, UseGuards } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Message } from '@prisma/client';
import { Server, Socket } from 'socket.io';
import { WsJwtGuard } from 'src/auth/ws-jwt/ws-jwt.guard';
import { SocketAuthMiddleWare } from 'src/auth/ws.mw';
import { NotificationService } from 'src/services/notification.service';
import { UserService } from 'src/user/user.service';

@WebSocketGateway({ namespace: 'events' })
@UseGuards(WsJwtGuard)
export class EventsGateway {
  constructor(
    private notificationService: NotificationService,
    private userService: UserService,
  ) {}

  @WebSocketServer()
  server: Server;

  afterInit(client: Socket) {
    client.use(SocketAuthMiddleWare() as any);
    Logger.log('afterInit');
  }

  @SubscribeMessage('message')
  handleMessage(): string {
    return 'Hello world!';
  }

  async sendMessage(message: Message) {
    this.server.emit('newMessage', message);
    const sender = await this.userService.findOneById(message.senderId);

    this.notificationService.send(sender.firstName, message.body, [
      message.recieverId,
    ]);
  }
}
