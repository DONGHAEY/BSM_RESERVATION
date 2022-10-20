import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Response } from 'express';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entity/User.entity';
import { ConfigService } from '@nestjs/config';
import BsmOauth, {
  BsmOauthError,
  BsmOauthErrorType,
  BsmOauthUserRole,
  StudentResource,
  TeacherResource,
} from 'bsm-oauth';
@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {
    this.bsmOauth = new BsmOauth(
      process.env.BSM_OAUTH_CLIENT_ID,
      process.env.BSM_OAUTH_CLIENT_SECRET,
    );
  }

  private bsmOauth: BsmOauth;

  async oauthBsm(res: Response, authCode: string) {
    let resource: StudentResource | TeacherResource;
    try {
      resource = await this.bsmOauth.getResource(
        await this.bsmOauth.getToken(authCode),
      );
    } catch (error) {
      if (error instanceof BsmOauthError) {
        switch (error.type) {
          case BsmOauthErrorType.INVALID_CLIENT: {
            throw new InternalServerErrorException('OAuth Failed');
          }
          case BsmOauthErrorType.AUTH_CODE_NOT_FOUND: {
            throw new NotFoundException('Authcode not found');
          }
          case BsmOauthErrorType.TOKEN_NOT_FOUND: {
            throw new NotFoundException('Token not found');
          }
        }
      }
      throw new InternalServerErrorException('OAuth Failed');
    }

    let userInfo = await this.userService.getUserBycode(resource.userCode);

    if (!userInfo) {
      // 유저를 저장한다.
      await this.userService.saveUser(resource);
      userInfo = await this.userService.getUserBycode(resource.userCode);
      if (!userInfo) {
        throw new NotFoundException('User not Found');
      }
    }
    console.log(userInfo);

    await this.login(res, userInfo);
    res.redirect('http://localhost:3000/');
  }

  async login(res: Response, userInfo: User) {}
}
