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
import BsmOauth, {
  BsmOauthUserRole,
  StudentResource,
  TeacherResource,
} from 'bsm-oauth';

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

  async saveUser(user: StudentResource | TeacherResource) {
    const userInfo = {
      userCode: user.userCode,
      email: user.email,
      nickname: user.nickname,
    };
    if (user.role === BsmOauthUserRole.STUDENT) {
      const studentInfo: any = {
        ...userInfo,
        name: user.student.name,
        classNo: user.student.classNo,
        grade: user.student.grade,
        studentNo: user.student.studentNo,
        enrolledAt: user.student.enrolledAt,
        role: BsmOauthUserRole.STUDENT,
      };
      return await StudentInfo.save({ ...studentInfo });
    }
    if (user.role === BsmOauthUserRole.TEACHER) {
      const teacherInfo: any = {
        ...userInfo,
        name: user.teacher.name,
        role: BsmOauthUserRole.TEACHER,
      };
      return await TeacherInfo.save({ ...teacherInfo });
    }
  }

  // async testForFindUserByCode(userCode: number): Promise<any> {
  //   return await this.userRepository.findOne({
  //     where: {
  //       userCode,
  //     },
  //   });
  // }
}
