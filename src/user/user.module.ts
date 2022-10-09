import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/User.entity';
import { StudentInfo } from './entity/StudentInfo.entity';
import { TeacherInfo } from './entity/TeacherInfo.entity';
@Module({
  imports: [TypeOrmModule.forFeature([User, StudentInfo, TeacherInfo])],
  exports: [UserService],
  providers: [UserService],
})
export class UserModule {}
