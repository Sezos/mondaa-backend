import { Socket } from 'socket.io';
import { WsJwtGuard } from './ws-jwt/ws-jwt.guard';

type SocketIOMiddleWare = {
  (client: Socket, next: (err?: Error) => void);
};

export const SocketAuthMiddleWare = (): SocketIOMiddleWare => {
  return (client, next) => {
    try {
      WsJwtGuard.validateToken(client);
      next();
    } catch (e) {
      next(e);
    }
  };
};
