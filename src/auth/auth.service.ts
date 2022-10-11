import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entity/User.entity';
@Injectable()
export class AuthService {
  constructor(
    private httpService: HttpService,
    private userService: UserService,
  ) {}

  readonly BSM_OAUTH_CLIENT_ID = 'e8f78fa2';
  readonly BSM_OAUTH_CLIENT_SECRET = 'b1c1feb1bec5fa28439b83f72c83856d';
  readonly GET_TOKEN_URL = 'https://auth.bssm.kro.kr/api/oauth/token';
  readonly GET_RESOURCE_URL = 'https://auth.bssm.kro.kr/api/oauth/resource';

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
    const userFind = await this.userService.getByCode(userResponse.code);
    if (userFind) {
      return userFind;
    } else {
      //register 부분
      console.log('ddd');
      const user = await this.userService.saveUser(userResponse, token);
      return user;
    }
  }

  async test(code: number) {
    return await this.userService.getByCode(code);
  }

  async generateAccessToken(userCode: number) {
    //jwt서비스 불러오는 곳..
  }
}
