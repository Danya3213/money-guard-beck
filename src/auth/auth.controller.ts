import { Body, Controller, Get, Post, Req, Res, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { IReturnedUser } from './interfaces/user.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { CheckUserDto } from './dto/check-user.dto';
import { SaveCookieInterceptor } from './interceptors/cookie.interceptor';
import { Response, Request } from 'express';
import { isValidTokenGuard } from '../global/guards/isValidToken.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {
  }

  @Post('reg')
  @UseInterceptors(SaveCookieInterceptor)
  async register(@Body() dto: CreateUserDto): Promise<IReturnedUser> {
    return this.authService.registration(dto);
  };

  @Post('login')
  @UseInterceptors(SaveCookieInterceptor)
  async login(@Body() dto: CheckUserDto): Promise<IReturnedUser | null> {
    return this.authService.login(dto);
  };

  @Get('logout')
  async logout(@Res() res: Response): Promise<void> {
    res.status(200).clearCookie('token').end();
    return;
  }

  @Get('check')
  @UseGuards(isValidTokenGuard)
  async checkToken(@Req() req: Request): Promise<undefined | string> {

    return this.authService.checkToken(req.cookies?.token);
  }

  // @Get('')
}