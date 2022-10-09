import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
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

  async getToken(authCode: string): Promise<any> {
    console.log(authCode);
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

  async getUserByCode(code: number) {
    return await this.userService.test(code);
  }

  async getUserByToken(token: string): Promise<any> {
    try {
      const userRequest = await this.httpService
        .post(this.GET_RESOURCE_URL, {
          clientId: this.BSM_OAUTH_CLIENT_ID,
          clientSecret: this.BSM_OAUTH_CLIENT_SECRET,
          token,
        })
        .toPromise();
      return userRequest.data.user || null;
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}
