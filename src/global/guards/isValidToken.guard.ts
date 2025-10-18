import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { IDecodedUser } from '../../auth/interfaces/user.interface';
import { Socket } from 'socket.io';

function parseCookieString(cookieString: string | undefined): Record<string, string> {
  if (!cookieString) return {};
  return Object.fromEntries(
    cookieString.split(';').map((c) => c.trim().split('='))
  );
}

@Injectable()
export class isValidTokenGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    let token: string | undefined;

    // HTTP запит
    if (context.getType() === 'http') {
      const request = context.switchToHttp().getRequest<Request>();
      token = request.cookies?.['token'];
    }

    // WebSocket подія
    if (context.getType() === 'ws') {
      const client: Socket = context.switchToWs().getClient();
      const cookies = parseCookieString(client.handshake.headers.cookie);
      token = cookies['token'];
      // можеш зберегти токен прямо в сокет для повторного використання
      (client as any).token = token;
    }

    if (!token) throw new NotFoundException('Invalid or expired token');

    try {
      this.jwtService.verify<IDecodedUser>(token);
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    return true;
  }
}
