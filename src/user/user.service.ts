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
import { Role } from './types/Role.type';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    private userRepository: UserRepository,
    private inChargeInfoRepository: InChargeInfoRepository,
    @InjectRepository(StudentInfo)
    private studentRepository: Repository<StudentInfo>,
    @InjectRepository(TeacherInfo)
    private teacherRepository: Repository<TeacherInfo>,
    @InjectRepository(SelfStudyTime)
    private selfStudyTimeRepository: Repository<SelfStudyTime>,
    @InjectRepository(HomeRoom)
    private homeRoomRepository: Repository<HomeRoom>,
  ) {}

  async setInchargeOfSelfStudyTime(
    userCode: number,
    selfStudyTimeDto: SelfStudyTimeDto,
  ): Promise<void> {
    await this.selfStudyTimeRepository.save({
      userCode,
      ...selfStudyTimeDto,
    });
  }

  async setInChargeOfHomeRoom(
    userCode: number,
    homeRoomDto: HomeRoomDto,
  ): Promise<void> {
    await this.homeRoomRepository.save({
      userCode,
      ...homeRoomDto,
    });
  }

  async getUserByCodeAndToken(userCode: number, token: string): Promise<any> {
    return await this.userRepository.findOne({
      where: {
        userCode,
        oauthToken: token,
      },
    });
  }

  async saveUser(user: any, token: string): Promise<void> {
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

  async testForFindUserByCode(userCode: number): Promise<any> {
    return await this.userRepository.findOne({
      where: {
        userCode,
      },
    });
  }
}
