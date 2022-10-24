import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  Query,
} from '@nestjs/common';
import { BsmOauthUserRole } from 'bsm-oauth';
import { GetUser } from 'src/auth/decorator/getUser.decorator';
import { Levels } from 'src/auth/decorator/level.decorator';
import { Roles } from 'src/auth/decorator/roles.decorator';
import JwtAuthGuard from 'src/auth/guards/auth.guard';
import { levelGuard } from 'src/auth/guards/level.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { User } from 'src/user/entity/User.entity';
import { Level } from 'src/user/types/Level.type';
import { AddEntryAvailableDto } from './dto/entryAvailable.dto';
import { RequestReservationDto } from './dto/requestReservation.dto';
import { RoomService } from './room.service';
import { RoomType } from './type/Room.type';

@Controller('room')
// @UseGuards(JwtAuthGuard, levelGuard, RolesGuard)
export class RoomController {
  constructor(private roomService: RoomService) {}

  /// 모든 룸 리스트를 불러오는 API ///
  @Get()
  async getAllRoomList() {
    // pagenation 두기
    return await this.roomService.getRoomList();
  }

  /// 특정 룸의 정보를 자세히 불러오는 API ///
  @Get('/:roomCode')
  async getRoomDetailInfo(@Query('roomCode') roomCode: number) {
    // 룸의 정보를 자세히 보여주어야하기 때문에, 오늘 예약이 되어있는 정보도 같이 보내주어야함.
    return await this.roomService.getRoomBycode(roomCode, true);
  }

  /// 특정 타입에 속해 있는 룸 리스트를 불러오는 API ///
  @Get('/roomType/:roomType')
  async getTypeRoomList(@Query('roomType') RoomType: RoomType) {
    return await this.roomService.getRoomList(RoomType);
  }

  ///// moving-certification Module 부분 /////
  /// 예약을 요청하는 API ///
  @Post('/request')
  @Roles(BsmOauthUserRole.STUDENT)
  async requestToTeacher(@Body() requestReservationDto: RequestReservationDto) {
    // 학생이 이석 요청을 한다, 이 API를 사용한다.
    // 1. 학생이 이석 요청 시, 요청하는 날짜와 요청하는 사항의 날짜가 일치하는지 확인한다.
    // 1-1 요청하는 사항의 시간대가 사용중인지, 예약이 되어있는지 확인한다.
    // 2. 함께하고자 하는 학생들이 모두 학생인지 확인한다.
    // 3. 학생이 현재 사용하고자 하는 시간대가 어떤 타입의 선생님에게 요청해야하는지 확인한다.
    // 4. 요청해야하는 선생님 타입에 따라 요청 할 특정 선생님 정보를 알아낸다. (예 : 자습담당 선생님에게 요청해야하면 오늘 자습담당 선생님에게 요청을 보낸다.)
    // 5. 선생님에게 소켓과 web push 를통해서, 알림을 보내고,
    // 6. 요청 사항 table을 DB에 저장한다.
  }

  /// 예약을 승인 및 거부하는 API ///
  @Post('/response')
  @Roles(BsmOauthUserRole.TEACHER)
  async responseToStudents(@Body() responseReservationDto) {
    // 선생님이 학생의 요청을 보고 응답을 한다, 이 API를 사용한다.
    // 1. 선생님이 학생에게 승인, 거부를 할 수 있다.
    // 2. 요청을 응답하는 선생님이 그 요청 사항에 기록된 요청된 선생님 정보와 일치하는지 확인한다.
    // 3. 요청을 거부 및 승인한다. (DB에 응답사항을 업데이트한다.)
  }
  ///// moving-certification Module 부분 /////

  // room을 등록하는 API ///
  @Post('registerRoom')
  @Levels(Level.ADMIN)
  async registerRoom(
    @GetUser() user: User,
    @Body('roomName') roomName: string,
    @Body('roomType') roomType: RoomType,
    @Body('roomCode') roomCode: number,
  ) {
    return await this.roomService.registerRoom(roomCode, roomType, roomName);
  }

  /// 방 입장 가능 정보를 추가하는 API ///
  @Post('/addAvailableEntryInfo')
  @Levels(Level.MANAGER)
  async addEntryAvailableInfo(
    @Body() addEntryAvailableDto: AddEntryAvailableDto,
  ) {
    return await this.roomService.addEntryAvailableInfo(addEntryAvailableDto);
  }
}
