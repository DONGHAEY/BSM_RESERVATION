import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Levels } from 'src/auth/decorator/level.decorator';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { SelfStudyTimeDto } from './dto/SelfStudyTime.dto';
import { User } from './entity/User.entity';
import { SelfStudyTimeRepository } from './repository/SelfStudyTime.repository';
import { StudentRepository } from './repository/Student.repository';
import { TeacherRepository } from './repository/Teacher.repository';
import { UserRepository } from './repository/User.Repository';
import { InCharge } from './types/InCharge.type';
import { Level } from './types/Level.type';
import { Role } from './types/Role.type';

@Injectable()
export class UserService {
  constructor(
    private userRepository: UserRepository,
    private studentRepository: StudentRepository,
    private teacherRepository: TeacherRepository,
    private selfStudyTimeRepository: SelfStudyTimeRepository,
  ) {}

  async setInchargeOfSelfStudyTime(
    userCode: number,
    selfStudyTime: SelfStudyTimeDto,
  ) {
    await this.selfStudyTimeRepository.save({
      ...selfStudyTime,
      userCode,
    });
  }

  async getUserByCodeAndToken(userCode: number, token: string) {
    return await this.userRepository.findOne({
      where: {
        userCode,
        oauthToken: token,
      },
    });
  }

  async saveUser(user: any, token: string) {
    if (user.role === Role.STUDENT) {
      return await this.studentRepository.save({
        ...user,
        userCode: user.code,
        role: Role.STUDENT,
        oauthToken: token,
      });
    }
    if (user.role === Role.TEACHER) {
      return await this.teacherRepository.save({
        ...user,
        userCode: user.code,
        role: Role.TEACHER,
        oauthToken: token,
      });
    }
  }

  async testForFindUserByCode(userCode: number) {
    return await this.userRepository.findOne({
      where: {
        userCode,
      },
    });
  }
}
