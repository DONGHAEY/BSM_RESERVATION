import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/User.entity';
import { StudentInfo } from './entity/StudentInfo.entity';
import { TeacherInfo } from './entity/TeacherInfo.entity';
import { UserRepository } from './repository/User.Repository';
import { TypeOrmForCustomRepositoryModule } from 'src/TypeormForCustomRepository/typeormForCustomRepository.module';
import { StudentRepository } from './repository/Student.repository';
import { TeacherRepository } from './repository/Teacher.repository';
import { SelfStudyTimeRepository } from './repository/SelfStudyTime.repository';
import { UserController } from './user.controller';
@Module({
  imports: [
    TypeOrmForCustomRepositoryModule.forCustomRepository([
      UserRepository,
      StudentRepository,
      TeacherRepository,
      SelfStudyTimeRepository,
    ]),
  ],
  exports: [UserService],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
