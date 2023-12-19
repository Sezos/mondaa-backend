import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Socket } from 'socket.io';
import { jwtConstants } from '../constants';
import { verify } from 'jsonwebtoken';

@Injectable()
export class WsJwtGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    if (context.getType() !== 'ws') return true;

    const client: Socket = context.switchToWs().getClient();
    WsJwtGuard.validateToken(client);
    return true;
  }

  static async validateToken(client: Socket) {
    try {
      const authorization = await client.handshake.auth.token._j;

      // const token: string = authorization.split(' ')[1];
      const payload = verify(authorization, jwtConstants.secret);
      return payload;
    } catch (err) {
      console.log(err);
    }
  }
}
