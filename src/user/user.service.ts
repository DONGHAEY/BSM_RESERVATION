import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/User.entity';
import { StudentRepository } from './repository/Student.repository';
import { TeacherRepository } from './repository/Teacher.repository';
import { UserRepository } from './repository/User.Repository';
import { Role } from './types/Role.type';

@Injectable()
export class UserService {
  constructor(
    private userRepository: UserRepository,
    private studentRepository: StudentRepository,
    private teacherRepository: TeacherRepository,
  ) {}

  async getUserByCodeAndToken(userCode: number, token: string) {
    return await this.userRepository.findOne({
      where: {
        userCode,
        oauthToken: token,
      },
    });
  }

  async saveUser(user: any, token: string) {
    console.log(user);
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
