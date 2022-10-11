import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/User.entity';
import { UserRepository } from './repository/User.Repository';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async getByCodeAndToken(code: number, token: string) {
    return await this.userRepository.findOne({
      where: {
        code,
        oauthToken: token,
      },
    });
  }

  async saveUser(user: User, token: string) {
    return await this.userRepository.save({
      ...user,
      oauthToken: token,
    });
  }
}
