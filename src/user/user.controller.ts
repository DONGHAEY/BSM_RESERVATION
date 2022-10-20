import { Controller, UseGuards } from '@nestjs/common';
import { GetUser } from 'src/auth/decorator/getUser.decorator';
import JwtAuthGuard from 'src/auth/guards/auth.guard';
import { User } from './entity/User.entity';

@Controller('user')
export class UserController {
  @UseGuards(JwtAuthGuard)
  getUserInfo(@GetUser() user: User) {
    return {
      ...user,
    };
  }
}
