import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StudentInfo } from './entity/StudentInfo.entity';
import { TeacherInfo } from './entity/TeacherInfo.entity';
import { UserRepository } from './repository/User.Repository';
import { Repository } from 'typeorm';
import { User } from './entity/User.entity';
import BsmOauth, {
  BsmOauthUserRole,
  StudentResource,
  TeacherResource,
} from 'bsm-oauth';
import { Level } from './types/Level.type';
import { HomeRoomDto } from './dto/HomeRoom.dto';
import { DormitoryDto } from './dto/Dormitory.dto';
import { SelfStudyTimeDto } from './dto/SelfStudyTime.dto';
import { InCharge } from './types/InCharge.type';
import { HomeRoom } from './entity/HomeRoom.entity';
import { SelfStudyTime } from './entity/SelfStudyTime.entity';
import { InChargeInfo } from './entity/InChargeInfo.entity';

@Injectable()
export class UserService {
  constructor(
    private userRepository: UserRepository,
    @InjectRepository(StudentInfo)
    private studentRepository: Repository<StudentInfo>,
    @InjectRepository(TeacherInfo)
    private teacherRepository: Repository<TeacherInfo>,
    @InjectRepository(HomeRoom)
    private homeRoomRepository: Repository<HomeRoom>,
    @InjectRepository(SelfStudyTime)
    private selfStudyTimeRepository: Repository<SelfStudyTime>,
    @InjectRepository(InChargeInfo)
    private inchargeInfoRepository: Repository<InChargeInfo>,
  ) {}

  async changeUserLevel(userCode: number, level: Level) {
    const isExist = await this.checkExist(userCode);
    if (!isExist) {
      throw new NotFoundException(
        `User has ${userCode} userCode is Not Founded to change that user`,
      );
    }
    await this.userRepository.update(
      {
        userCode,
      },
      {
        level,
      },
    );
  }

  async addInchargeInfo(
    userCode: number,
    dto: HomeRoomDto | DormitoryDto | SelfStudyTimeDto,
  ) {
    const isExist = await this.checkExist(userCode);
    if (!isExist) {
      throw new NotFoundException(
        `User has ${userCode} userCode is Not Founded to addInchargeInfo that user`,
      );
    }
    const user = await this.userRepository.findOne({
      where: {
        userCode,
      },
    });
    const isTeacher = await this.checkRole(user, BsmOauthUserRole.TEACHER);
    if (!isTeacher) {
      throw new HttpException(
        `User has ${userCode} doesn't have Teacher Role`,
        HttpStatus.BAD_REQUEST,
      );
    }
    //INCHARGE TYPE 에 따라 다르게 저장해야한다
    if (dto.incharge === InCharge.DORMITORY) {
      await this.inchargeInfoRepository.save({ ...dto, userCode });
    }
    if (dto.incharge === InCharge.HOMEROOM) {
      await this.homeRoomRepository.save({ ...dto, userCode });
    }
    if (dto.incharge === InCharge.SELFSTUDYTIME) {
      await this.selfStudyTimeRepository.save({ ...dto, userCode });
    }
  }

  async getUserBycode(
    userCode: number,
  ): Promise<User | TeacherInfo | StudentInfo> {
    return await this.userRepository.findOne({
      where: {
        userCode,
      },
    });
  }

  async saveUser(user: StudentResource | TeacherResource, userToken: string) {
    const { userCode, email, nickname } = user;
    const userInfo = {
      userCode: userCode,
      email: email,
      nickname: nickname,
      token: userToken,
    };
    if (user.role === BsmOauthUserRole.STUDENT) {
      const { name, classNo, grade, studentNo, enrolledAt } = user.student;
      const studentInfo: any = {
        ...userInfo,
        name: name,
        classNo: classNo,
        grade: grade,
        studentNo: studentNo,
        enrolledAt: enrolledAt,
        role: BsmOauthUserRole.STUDENT,
      };
      return await this.studentRepository.save(studentInfo);
    }
    if (user.role === BsmOauthUserRole.TEACHER) {
      const { name } = user.teacher;
      const teacherInfo: any = {
        ...userInfo,
        name: name,
        role: BsmOauthUserRole.TEACHER,
      };
      return await this.teacherRepository.save(teacherInfo);
    }
  }

  private async checkExist(userCode: number): Promise<boolean> {
    const findUser = await this.getUserBycode(userCode);
    if (findUser) {
      return true;
    } else false;
  }

  private async checkRole(
    user: User,
    role: BsmOauthUserRole,
  ): Promise<boolean> {
    if (user.role === role) {
      return true;
    }
    return false;
  }
}
