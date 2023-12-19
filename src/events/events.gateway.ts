import { UseGuards } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';
import { WsJwtGuard } from 'src/auth/ws-jwt/ws-jwt.guard';
import { SocketAuthMiddleWare } from 'src/auth/ws.mw';
import { NotificationService } from 'src/services/notification.service';
import { UserService } from 'src/user/user.service';

@WebSocketGateway({
  namespace: 'events',
  cors: true,
})
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
  }

  @SubscribeMessage('message')
  handleMessage(): string {
    return 'Hello world!';
  }

  async sendMessage(message: any) {
    console.log(message);
    this.server.emit('group_' + message.groupId, message);

    const sender = await this.userService.findOneById(message.senderId);

    return await this.notificationService.send(sender.firstName, message.body, [
      message.groupId,
    ]);
  }
}
