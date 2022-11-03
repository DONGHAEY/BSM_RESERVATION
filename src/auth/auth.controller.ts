import { Controller, Get, Query, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
@Controller('oauth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Get('bsm')
  async login(
    @Res({ passthrough: true }) res: Response,
    @Query('code') authCode: string,
  ) {
    // return authCode;
    return this.authService.oauthBsm(res, authCode);
  }
  @Get('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    return this.authService.logout(res);
  }
}
