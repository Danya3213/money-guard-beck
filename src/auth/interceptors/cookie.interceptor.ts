import { Injectable, NestInterceptor, ExecutionContext, CallHandler, NotFoundException } from '@nestjs/common';
import { catchError, map, Observable, throwError } from 'rxjs';
import { IReturnedUser } from '../interfaces/user.interface';
import { Response } from 'express';

@Injectable()
export class SaveCookieInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<IReturnedUser>): Observable<Omit<IReturnedUser, "token">> {

    const res:Response = context.switchToHttp().getResponse<Response>();

    return next.handle().pipe(map((data) => {

      const { token, ...restOfData } = data;

      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 1000 * 60 * 60,
      });

      return restOfData;
    }));
  }
}