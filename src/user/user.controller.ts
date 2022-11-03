import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { GetUser } from 'src/auth/decorator/getUser.decorator';
import { Levels } from 'src/auth/decorator/level.decorator';
import JwtAuthGuard from 'src/auth/guards/auth.guard';
import { levelGuard } from 'src/auth/guards/level.guard';
import { DormitoryDto } from './dto/Dormitory.dto';
import { HomeRoomDto } from './dto/HomeRoom.dto';
import SearchUserDto from './dto/searchUser.dto';
import { SelfStudyTimeDto } from './dto/SelfStudyTime.dto';
import { User } from './entity/User.entity';
import { Level } from './types/Level.type';
import { UserService } from './user.service';

@Controller('user')
@UseGuards(JwtAuthGuard, levelGuard)
export class UserController {
  constructor(private userService: UserService) {}

  /// 자신의 유저정보를 반환하는 API ///
  @Get('/')
  getUserInfo(@GetUser() user: User) {
    return user;
  }

  /// 다른사람의 유저 정보를 반환하는 API ///
  @Get('/:userCode')
  async getOtherUserInfo(@Query('userCode') userCode: number) {
    return await this.userService.getUserBycode(userCode);
  }

  /// 유저의 이름으로 유저들을 검색할 수 있는 API ///
  @Get('/search')
  async searchUser(@Body() searchUserDto: SearchUserDto) {
    return await this.userService.searchUser(searchUserDto);
  }

  /// 유저의 서비스 레벨을 변환할 수 있는 API - 관리자 권한 이상 ///
  @Post('/:userCode/changeUserLevel')
  @Levels(Level.ADMIN)
  async changeUserLevel(
    @Query('userCode') userCode: number,
    @Body('level') level: Level,
  ) {
    return await this.userService.changeUserLevel(userCode, level);
  }

  ///  선생님의 담당정보를 추가하는 API - 매니저 권한 이상 ///
  @Post('/:userCode/inchargeInfo')
  @Levels(Level.MANAGER)
  async addInchargeInfo(
    @Query('userCode') userCode: number,
    @Body() inChargeDto: HomeRoomDto | SelfStudyTimeDto | DormitoryDto,
  ) {
    await this.userService.addInchargeInfo(userCode, inChargeDto);
  }

  /// 선생님의 담당정보를 삭제하는 API - 매니저 권한 이상 ///
  @Post('/:userCode/inchargeInfo')
  @Levels(Level.MANAGER)
  async deleteInchargeInfo(@Query('inChargeCode') inChargeCode: number) {
    await this.userService.deleteInchargeInfo(inChargeCode);
  }
}
