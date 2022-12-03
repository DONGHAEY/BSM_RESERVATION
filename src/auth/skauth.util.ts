import { Injectable, Req } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// import { plainToClass } from '@nestjs/class-transformer';
import { Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entity/User.entity';
import { Token } from './entity/token.entity';
import { UserService } from 'src/user/user.service';
import { Request } from 'express';

@Injectable()
export class SKAuthUtil {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    @InjectRepository(Token) private tokenRepository: Repository<Token>,
  ) {}

  private clients: {
    [index: string]: {
      socket: Socket;
      user: User;
    };
  } = {};

  getCookieValue(cookieString: string, extractString: string) {
    let str = '';
    if (cookieString.includes(extractString)) {
      let idx = cookieString.indexOf(extractString);

      while (true) {
        if (cookieString[idx] === '=') {
          break;
        }
        idx += 1;
      }
      idx += 1;
      while (true) {
        if (idx === cookieString.length - 1 || cookieString[idx] === ';') {
          break;
        }
        str += cookieString[idx];
        idx += 1;
      }
    }
    return str;
  }

  async authClient(client: Socket): Promise<User | null> {
    // 만약 클라이언트가 이미 인증되었다면
    if (this.clients[client.id]) {
      return this.clients[client.id].user;
    }
    let token = this.getCookieValue(
      client.request.headers.cookie.toString(),
      'token',
    );
    try {
      return this.jwtService.verify(token, {
        secret: process.env.SECRET_KEY,
      });
    } catch (error) {}
    // 인증에 실패했다면 리프레시 토큰이 사용 가능한지 확인
    let refreshToken = this.getCookieValue(
      client.request.headers.cookie.toString(),
      'refreshToken',
    );
    console.log(refreshToken);
    if (!refreshToken) {
      return null;
    }
    try {
      refreshToken = this.jwtService.verify(refreshToken, {
        secret: process.env.SECRET_KEY,
      }).refreshToken;
    } catch (error) {
      return null;
    }

    const tokenInfo = await this.tokenRepository.findOne({
      where: { token: refreshToken },
    });
    if (tokenInfo === null) return null;
    const userInfo: User = await this.userService.getUserBycode(
      tokenInfo.userCode,
    );
    if (userInfo === null) return null;
    return userInfo;
  }
}
