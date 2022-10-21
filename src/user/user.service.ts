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
    const user: User = await this.getUserBycode<User>(userCode);
    await this.userRepository.update(
      {
        userCode: user.userCode,
      },
      {
        level,
      },
    );
  }

  async addInchargeInfo(
    userCode: number,
    dto: HomeRoomDto | DormitoryDto | SelfStudyTimeDto,
  ): Promise<void> {
    const user: TeacherInfo = await this.getUserBycode<TeacherInfo>(userCode);
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

  async getUserBycode<T>(userCode: number): Promise<T> {
    const user = await this.userRepository.findOne({
      where: {
        userCode,
      },
    });
    if (!user) {
      throw new NotFoundException(`${userCode} user Has Not Founded`);
    }
    return <T>user;
  }

  async saveUser(
    user: StudentResource | TeacherResource,
    token: string,
  ): Promise<StudentInfo | TeacherInfo> {
    if (user.role === BsmOauthUserRole.STUDENT) {
      return await this.studentRepository.save({ ...user, token });
    }
    if (user.role === BsmOauthUserRole.TEACHER) {
      return await this.teacherRepository.save({ ...user, token });
    }
  }
}
