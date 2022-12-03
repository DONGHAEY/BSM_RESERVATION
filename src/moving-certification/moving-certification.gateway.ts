import { Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import cookieParser from 'cookie-parser';
import { Socket } from 'socket.io';
import { Request } from 'express';
import { Server } from 'http';
import { User } from 'src/user/entity/User.entity';
import { SKAuthUtil } from 'src/auth/skauth.util';
import JwtAuthGuard from 'src/auth/guards/auth.guard';
import { GetUser } from 'src/auth/decorator/getUser.decorator';
import { MovingCertificationService } from './moving-certification.service';
import { RequestReservationDto } from './dto/requestReservation.dto';
import { ResponseReservationDto } from './dto/responseReservation.dto';

@WebSocketGateway({
  cors: true,
  transport: ['websocket'],
})
export class CertificatingGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private skAuth: SKAuthUtil,
    private movingCertificationService: MovingCertificationService,
  ) {}

  private clients: {
    [index: number]: {
      user: User;
      socket: Socket;
    };
  } = {};

  @WebSocketServer()
  server: Server;

  async handleConnection(socket: Socket) {
    const user: User = await this.skAuth.authClient(socket);
    if (!user) {
      throw new UnauthorizedException();
    }
    this.clients[user.userCode] = {
      user,
      socket,
    };
    socket['userInfo'] = user;
    const myWatingList =
      await this.movingCertificationService.getMyWatingRequests(user);
    myWatingList.map((watingRequest) => {
      socket.emit('watingRequest', watingRequest);
    });
  }

  async handleDisconnect(socket: Socket) {
    const user: User = await this.skAuth.authClient(socket);
    if (!user) {
      throw new UnauthorizedException();
    }
    delete this.clients[user.userCode];
  }

  private emitToUser(
    user: User,
    emitName: string,
    sendData: any,
    exactCallback: any = null,
  ) {
    const info = this.clients[user.userCode];
    if (info) {
      info.socket.emit(emitName, sendData);
    } else {
      if (exactCallback) {
        exactCallback();
      }
    }
  }

  private emitToUsers(
    userList: User[],
    emitName: string,
    sendData: any,
    exactCallback: any,
  ) {
    userList.map((user) => {
      this.emitToUser(user, emitName, sendData, exactCallback);
    });
  }

  @SubscribeMessage('require')
  async requestRoom(
    socket: Socket,
    requestReservationDto: RequestReservationDto,
  ) {
    // await this.movingCertificationService.requestRoom(
    //   requestReservationDto,
    //   this.emitToUsers,
    // );
  }

  @SubscribeMessage('response')
  async responseRoom(
    socket: Socket,
    responseReservationDto: ResponseReservationDto,
  ) {
    // const respondedReservation =
    //   await this.movingCertificationService.responseRoom(
    //     socket['userInfo'],
    //     responseReservationDto,
    //     this.emitToUsers,
    //   );
  }

  @SubscribeMessage('test')
  async handleMessage(socket: Socket, payload: any) {
    this.emitToUser(socket['userInfo'], 'go', 'test', () => {});
  }
}
