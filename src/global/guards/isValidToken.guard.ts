import { CanActivate, ExecutionContext, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { IDecodedUser } from '../../auth/interfaces/user.interface';

@Injectable()
export class isValidTokenGuard implements CanActivate {

  constructor(private readonly jwtService: JwtService) {
  }

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const token: string | undefined = request.cookies['token'];

    if (!token) throw new NotFoundException('Invalid or expired token');

    try {

      this.jwtService.verify<IDecodedUser>(token);

    } catch (err) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    return true;
  }
}