import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { GetUser } from 'src/auth/decorator/getUser.decorator';
import { Levels } from 'src/auth/decorator/level.decorator';
import JwtAuthGuard from 'src/auth/guards/auth.guard';
import { levelGuard } from 'src/auth/guards/level.guard';
import { DormitoryDto } from './dto/Dormitory.dto';
import { HomeRoomDto } from './dto/HomeRoom.dto';
import { SelfStudyTimeDto } from './dto/SelfStudyTime.dto';
import { User } from './entity/User.entity';
import { Level } from './types/Level.type';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  // 유저정보를 반환하는 API
  @UseGuards(JwtAuthGuard)
  @Get('/')
  getUserInfo(@GetUser() user: User) {
    return user;
  }

  @UseGuards(JwtAuthGuard, levelGuard)
  @Post('/:userCode/changeUserLevel')
  @Levels(Level.ADMIN)
  async changeUserLevel(
    @Query('userCode') userCode: number,
    @Body('level') level: Level,
  ) {
    return await this.userService.changeUserLevel(userCode, level);
  }

  @UseGuards(JwtAuthGuard, levelGuard)
  @Post('/:userCode/addInchargeInfo')
  @Levels(Level.MANAGER)
  async addInchargeInfo(
    @Query('userCode') userCode: number,
    @Body() inchargeDto: HomeRoomDto | SelfStudyTimeDto | DormitoryDto,
  ) {
    await this.userService.addInchargeInfo(userCode, inchargeDto);
  }
}
