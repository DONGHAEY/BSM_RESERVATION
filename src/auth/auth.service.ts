import { InjectRepository } from '@nestjs/typeorm';
import { Response } from 'express';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entity/User.entity';
import { Repository } from 'typeorm';
import BsmOauth, {
  BsmOauthError,
  BsmOauthErrorType,
  StudentResource,
  TeacherResource,
} from 'bsm-oauth';
import { Token } from './entity/token.entity';
import { randomBytes } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    @InjectRepository(Token)
    private tokenRepository: Repository<Token>,
  ) {
    this.bsmOauth = new BsmOauth(
      process.env.BSM_OAUTH_CLIENT_ID,
      process.env.BSM_OAUTH_CLIENT_SECRET,
    );
  }

  private bsmOauth: BsmOauth;

  async oauthBsm(res: Response, authCode: string) {
    let userToken: string;
    let resource: StudentResource | TeacherResource;
    try {
      (userToken = await this.bsmOauth.getToken(authCode)),
        (resource = await this.bsmOauth.getResource(userToken));
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

    let userInfo: User = await this.userService.getUserBycode<User>(
      resource.userCode,
    );

    if (!userInfo) {
      // 유저를 저장한다.
      await this.userService.saveUser(resource, userToken);
      userInfo = await this.userService.getUserBycode(resource.userCode);
      if (!userInfo) {
        throw new NotFoundException('User not Found');
      }
    }
    await this.login(res, userInfo);
    res.redirect(process.env.CLIENT_REDIRECT);
  }

  async login(res: Response, user: User) {
    const token = this.jwtService.sign(
      { ...user },
      {
        secret: process.env.SECRET_KEY,
        algorithm: 'HS256',
        expiresIn: '1h',
      },
    );
    const refreshToken = this.jwtService.sign(
      {
        refreshToken: (await this.createToken(user.userCode)).token,
      },
      {
        secret: process.env.SECRET_KEY,
        algorithm: 'HS256',
        expiresIn: '24h',
      },
    );

    res.cookie('token', token, {
      path: '/',
      httpOnly: true,
      maxAge: 1000 * 60 * 60,
    });
    res.cookie('refreshToken', refreshToken, {
      path: '/',
      httpOnly: true,
      maxAge: 24 * 60 * 1000 * 60 * 1,
    });
    return {
      token,
      refreshToken: refreshToken,
    };
  }

  async logout(res: Response) {
    res.cookie('token', '', {
      path: '/',
      httpOnly: true,
      maxAge: 0,
    });
    res.cookie('refreshToken', '', {
      path: '/',
      httpOnly: true,
      maxAge: 0,
    });
  }

  private async createToken(userCode: number): Promise<Token> {
    const refreshToken = new Token();
    refreshToken.token = randomBytes(64).toString('hex');
    refreshToken.userCode = userCode;
    refreshToken.valid = true;
    refreshToken.createdAt = new Date();
    await this.tokenRepository.save(refreshToken);
    return refreshToken;
  }
}
