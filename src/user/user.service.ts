import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/User.entity';
import { StudentRepository } from './repository/Student.repository';
import { UserRepository } from './repository/User.Repository';
import { Role } from './types/Role.type';

@Injectable()
export class UserService {
  constructor(
    private userRepository: UserRepository,
    private studentRepository: StudentRepository,
  ) {}

  async getByCodeAndToken(code: number, token: string) {
    return await this.userRepository.findOne({
      where: {
        code,
        oauthToken: token,
      },
    });
  }

  async getByCode(code: number) {
    return await this.userRepository.findOne({
      where: {
        code,
      },
    });
  }

  async saveUser(user: User, token: string) {
    if (user.role === Role.STUDENT) {
      return await this.studentRepository.save({
        ...user,
        role: Role.STUDENT,
        oauthToken: token,
      });
    }
  }
}
