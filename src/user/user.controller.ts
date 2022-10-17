import { Body, Controller, Get, Query } from '@nestjs/common';
import { SelfStudyTimeDto } from './dto/SelfStudyTime.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('/:userCode/testForSetSelfStudyTimeInfo')
  async testForSetSelfStudyTimeInfo(
    @Query('userCode') userCode: number,
    @Body() SelfStudyTimeDto: SelfStudyTimeDto,
  ) {
    return await this.userService.setInchargeOfSelfStudyTime(
      userCode,
      SelfStudyTimeDto,
    );
  }
}
