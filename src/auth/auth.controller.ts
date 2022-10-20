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
// https://auth.bssm.kro.kr/oauth?clientId=e8f78fa2&redirectURI=http://localhost:3000/afterLogin
@Controller('oauth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('bsm')
  async login(
    @Res({ passthrough: true }) res: Response,
    @Query('code') authCode: string,
  ) {
    return this.authService.oauthBsm(res, authCode);
    // const token = await this.authService.fetchToken(authcode);
    // if (!token) {
    //   throw new UnauthorizedException('Authcode is invaild');
    // }
    // const logined = await this.authService.loginOrRegister(token);
    // res.cookie('Authentication', logined.accessToken, {
    //   httpOnly: true,
    //   maxAge: 1000 * 60 * 60,
    // });
    // return res.json(logined);
  }

  // @UseGuards(JwtAuthGuard)
  // @Get('Authenticate')
  // async authenticate(@GetUser() user: User) {
  //   return {
  //     success: true,
  //     user: user,
  //   };
  // }

  // @Get('logout')
  // @UseGuards(JwtAuthGuard)
  // async logout(@Res() res) {
  //   res.cookie('Authentication', '', {
  //     maxAge: 0,
  //   });
  // }

  // @Get('testForFindUserByCode')
  // async test(@Body('code') code: number) {
  //   console.log(process.env.ACCESSTOKEN_SECRET_KEY);
  //   return await this.authService.testForFindUserByCode(code);
  // }
}
