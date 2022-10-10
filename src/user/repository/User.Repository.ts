import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entity/User.entity';
import { CustomRepository } from 'src/TypeormForCustomRepository/CustomRepository.decorator';
import { Role } from '../types/Role.type';

@CustomRepository(User)
export class UserRepository extends Repository<User> {
  async getUserByCode(code: number): Promise<User> {
    const user = await this.findOne({
      where: {
        code,
      },
    });
    if (!user) {
      throw new HttpException('해당하는 유저가 없습니다', HttpStatus.NOT_FOUND);
    }
    if (user.role === Role.STUDENT) {
      return await this.findOne({
        where: {
          code,
        },
        relations: ['studentInfo'],
      });
    }
    if (user.role === Role.TEACHER) {
      return await this.findOne({
        where: {
          code,
        },
        relations: ['teacherInfo', 'teacherInfo.inCharged'], //선생님의 담당 정보까지 보여주기
      });
    }
  }
}
