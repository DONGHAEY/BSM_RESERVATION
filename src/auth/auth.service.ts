import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entity/User.entity';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class AuthService {
  constructor(
    private httpService: HttpService,
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  readonly BSM_OAUTH_CLIENT_ID = this.configService.get('BSM_OAUTH_CLIENT_ID');
  readonly BSM_OAUTH_CLIENT_SECRET = this.configService.get(
    'BSM_OAUTH_CLIENT_SECRET',
  );
  readonly GET_TOKEN_URL = this.configService.get('GET_TOKEN_URL');
  readonly GET_RESOURCE_URL = this.configService.get('GET_RESOURCE_URL');
  readonly ACCESSTOKEN_SECRET_KEY = this.configService.get(
    'ACCESSTOKEN_SECRET_KEY',
  );

  async fetchToken(authCode: string): Promise<any> {
    //BSM에서 authcode를 받아와 불변성 유저토큰을 받아내는 코드이다.
    try {
      const TokenRequest = await this.httpService
        .post(this.GET_TOKEN_URL, {
          clientId: this.BSM_OAUTH_CLIENT_ID,
          clientSecret: this.BSM_OAUTH_CLIENT_SECRET,
          authCode,
        })
        .toPromise();
      return TokenRequest.data.token || null;
    } catch (e) {
      console.log(e.response.message);
      throw new UnauthorizedException();
    }
  }

  async fetchUserByToken(token: string): Promise<User> {
    //BSM에서 받아온 토큰을 통해 유저를 가져오는 코드이다.
    try {
      const userResponse = await this.httpService
        .post(this.GET_RESOURCE_URL, {
          clientId: this.BSM_OAUTH_CLIENT_ID,
          clientSecret: this.BSM_OAUTH_CLIENT_SECRET,
          token,
        })
        .toPromise();
      return userResponse.data.user || null;
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  async loginOrRegister(token: string) {
    //login 부분
    const userResponse = await this.fetchUserByToken(token);
    //db에서 유저를 찾는 코드
    let userFind = await this.userService.getUserByCodeAndToken(
      userResponse.userCode,
      token,
    );
    if (!userFind) {
      //register 부분
      userFind = await this.userService.saveUser(userResponse, token);
    }
    const payload = {
      userCode: userFind.userCode,
      email: userFind.email,
    };
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.ACCESSTOKEN_SECRET_KEY,
      expiresIn: '1h',
    });
    return {
      refreshToken,
      user: userFind,
    };
  }

  async test(userCode: number) {
    return await this.userService.test(userCode);
  }

  async generateAccessToken(userCode: number) {
    //jwt서비스 불러오는 곳..
  }
}
