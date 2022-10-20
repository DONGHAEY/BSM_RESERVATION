import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HomeRoomDto } from './dto/HomeRoom.dto';
import { SelfStudyTimeDto } from './dto/SelfStudyTime.dto';
import { HomeRoom } from './entity/HomeRoom.entity';
import { InChargeInfo } from './entity/InChargeInfo.entity';
import { SelfStudyTime } from './entity/SelfStudyTime.entity';
import { StudentInfo } from './entity/StudentInfo.entity';
import { TeacherInfo } from './entity/TeacherInfo.entity';
import { InChargeInfoRepository } from './repository/InchargeInfo.repository';
import { UserRepository } from './repository/User.Repository';
import { InCharge } from './types/InCharge.type';
import { Level } from './types/Level.type';
import { Repository } from 'typeorm';
import { User } from './entity/User.entity';
import { StudentSignUpRequest } from './dto/StudentSignUpRequest.dto';
import { TeacherSignUpRequest } from './dto/TeacherSignUp.dto';
import { UserSignUpRequest } from './dto/UserSignUpRequest.dto';

@Injectable()
export class UserService {
  constructor(
    private userRepository: UserRepository,
    @InjectRepository(StudentInfo)
    private studentRepository: Repository<StudentInfo>,
    @InjectRepository(TeacherInfo)
    private teacherRepository: Repository<TeacherInfo>,
  ) {}

  async getUserBycode(
    userCode: number,
  ): Promise<User | TeacherInfo | StudentInfo> {
    return await this.userRepository.findOne({
      where: {
        userCode,
      },
    });
  }

  // async saveUser<T>(user : T) {
  //   if (user.role === Role.STUDENT) {
  //     await this.studentRepository.save({
  //       ...user,
  //       userCode: user.userCode,
  //       role: Role.STUDENT
  //     });
  //   }
  //   if (user.role === Role.TEACHER) {
  //     return await this.teacherRepository.save({
  //       ...user,
  //       userCode: user.code,
  //       role: Role.TEACHER
  //     });
  //   }
  // }

  // async testForFindUserByCode(userCode: number): Promise<any> {
  //   return await this.userRepository.findOne({
  //     where: {
  //       userCode,
  //     },
  //   });
  // }
}
