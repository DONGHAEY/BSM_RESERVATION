import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/User.entity';
import { StudentInfo } from './entity/StudentInfo.entity';
import { TeacherInfo } from './entity/TeacherInfo.entity';
import { UserRepository } from './repository/User.Repository';
import { TypeOrmForCustomRepositoryModule } from 'src/TypeormForCustomRepository/typeormForCustomRepository.module';
import { InChargeInfoRepository } from './repository/InchargeInfo.repository';
import { SelfStudyTime } from './entity/SelfStudyTime.entity';
import { HomeRoom } from './entity/HomeRoom.entity';
import { UserController } from './user.controller';
import { InChargeInfo } from './entity/InChargeInfo.entity';
@Module({
  imports: [
    TypeOrmForCustomRepositoryModule.forCustomRepository([
      UserRepository,
      InChargeInfoRepository,
    ]),
    TypeOrmModule.forFeature([
      SelfStudyTime,
      HomeRoom,
      StudentInfo,
      TeacherInfo,
      HomeRoom,
      InChargeInfo,
      SelfStudyTime,
    ]),
  ],
  exports: [UserService],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
