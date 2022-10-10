import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/User.entity';
import { StudentInfo } from './entity/StudentInfo.entity';
import { TeacherInfo } from './entity/TeacherInfo.entity';
import { UserRepository } from './repository/User.Repository';
import { TypeOrmForCustomRepositoryModule } from 'src/TypeormForCustomRepository/typeormForCustomRepository.module';
@Module({
  imports: [
    TypeOrmForCustomRepositoryModule.forCustomRepository([UserRepository]),
  ],
  exports: [UserService],
  providers: [UserService],
})
export class UserModule {}
