import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/User.entity';
import { UserRepository } from './repository/User.Repository';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async test(userCode: number) {
    return await this.userRepository.findOne({
      where: {
        code: userCode,
      },
      relations: ['studentInfo'],
    });
  }
}
