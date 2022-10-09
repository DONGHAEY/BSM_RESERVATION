import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Redirect,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
// https://auth.bssm.kro.kr/oauth?clientId=e8f78fa2&redirectURI=http://localhost:3000/afterLogin
@Controller('oauth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('login')
  async login(@Res() res, @Query('code') authcode: string) {
    console.log(authcode + ' dddd');
    const token = await this.authService.getToken(authcode);
    if (!token) {
      console.log('이거때문은 아니잖아 좀,..2');
      throw new UnauthorizedException('Authcode is invaild');
    }
    console.log(token);
    const user = await this.authService.getUserByToken(token);
    res.cookie('Authentication', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60,
    });
    console.log(user);
    return res.json({
      success: true,
      user,
    });
  }

  @Get('logout')
  async logout(@Res() res) {
    res.cookie('Authentication', '', {
      maxAge: 0,
    });
  }

  @Get('test')
  async userFetch(@Body('usercode') usercode: number) {
    return await this.authService.getUserByCode(usercode);
  }
}
