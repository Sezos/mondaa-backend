import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
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
    console.log(client.handshake.auth);
    WsJwtGuard.validateToken(client);
    return true;
  }

  static async validateToken(client: Socket) {
    try {
      const authorization = await client.handshake.auth.token._j;
      Logger.log(client.handshake, authorization);

      // const token: string = authorization.split(' ')[1];
      const payload = verify(authorization, jwtConstants.secret);
      console.log('isOkay', payload);
      return payload;
    } catch (err) {
      console.log(err);
    }
  }
}
