import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  Query,
  Delete,
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
import { RoomService } from './room.service';
import { RoomType } from './type/Room.type';

@Controller('room')
@UseGuards(JwtAuthGuard, levelGuard, RolesGuard)
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
    // 룸의 정보를 자세히 보여주어야하기 때문에, 요일별 입장가능 정보들.
    // 그 방의 오늘에 해당하는 현재 예약요청중 정보(WATING), 예약완료된(ALLOWED) 정보들
    return await this.roomService.getRoomBycode(roomCode, true);
  }

  /// 특정 타입에 속해 있는 룸 리스트를 불러오는 API ///
  @Get('/roomType/:roomType')
  async getTypeRoomList(@Query('roomType') RoomType: RoomType) {
    return await this.roomService.getRoomList(RoomType);
  }

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

  @Delete('/deleteAvailableEntryInfo')
  async deleteAvailableInfo() {}
}
