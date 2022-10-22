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
import { RoomService } from './room.service';
import { RoomType } from './type/Room.type';

@Controller('room')
@UseGuards(JwtAuthGuard, levelGuard, RolesGuard)
export class RoomController {
  constructor(private roomService: RoomService) {}

  /// 모든 룸 리스트를 불러오는 API ///
  @Get()
  async getAllRoomList() {}

  /// 특정 타입에 속해 있는 룸 리스트를 불러오는 API ///
  @Get('/:roomType')
  async getTypeRoomList(@Query('roomType') RoomType: RoomType) {}

  /// 특정 룸의 정보를 자세히 불러오는 API ///
  @Get('/:roomCode')
  async getRoomDetailInfo(@Query('roomCode') roomCode: number) {}

  @Post('/request')
  @Roles(BsmOauthUserRole.STUDENT)
  async requestToTeacher(@Body() requestReservationDto) {}

  @Post('/response')
  @Roles(BsmOauthUserRole.TEACHER)
  async responseToStudents(@Body() responseReservationDto) {}

  // room을 등록하는
  @Post('registerRoom')
  @Levels(Level.ADMIN)
  async registerRoom(
    @GetUser() user: User,
    @Body('roomName') roomName: string,
    @Body('roomType') roomType: RoomType,
    @Body('roomCode') roomCode: number,
  ) {
    return await this.roomService.createRoom(roomCode, roomType, roomName);
  }

  @Post('/:roomCode/addAvailableEntryInfo')
  @Levels(Level.MANAGER)
  async addEntryAvailableInfo(
    @Query('roomCode') roomCode: number,
    @Body() addEntryAvailableDto: AddEntryAvailableDto,
  ) {
    return await this.roomService.addEntryAvailableInfo(
      roomCode,
      addEntryAvailableDto,
    );
  }
}
