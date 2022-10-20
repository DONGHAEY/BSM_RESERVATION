import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Redirect,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import JwtAuthGuard from './guards/auth.guard';
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
    console.log(process.env.SECRET_KEY, '==============');
    return this.authService.oauthBsm(res, authCode);
  }
}
