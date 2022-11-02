import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StudentInfo } from './entity/StudentInfo.entity';
import { TeacherInfo } from './entity/TeacherInfo.entity';
import { UserRepository } from './repository/User.Repository';
import { Repository, Like } from 'typeorm';
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
import SearchUserDto from './dto/searchUser.dto';
import { EntryAvailable } from 'src/room/entity/EntryAvailable.entity';

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

  async changeUserLevel(userCode: number, level: Level): Promise<void> {
    const user: User = await this.getUserBycode<User>(userCode);
    if (user) {
      await this.userRepository.update(
        {
          userCode: user.userCode,
        },
        {
          level,
        },
      );
    }
  }

  async addInchargeInfo(
    userCode: number,
    dto: HomeRoomDto | DormitoryDto | SelfStudyTimeDto,
  ): Promise<void> {
    const teacherInfo: TeacherInfo = await this.getUserBycode<TeacherInfo>(
      userCode,
    );
    await this.rolePass(teacherInfo, BsmOauthUserRole.TEACHER);
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

  async deleteInchargeInfo(inChargeCode: number): Promise<void> {
    const inChargeInfo = await this.getInchargeInfoBycode(inChargeCode);
    if (inChargeCode) {
      await this.inchargeInfoRepository.delete({
        inChargeCode: inChargeInfo.inChargeCode,
      });
    }
  }

  async searchUser(searchUserDto: SearchUserDto) {
    const searchedUsers = await this.userRepository.find({
      where: {
        name: Like(`%${searchUserDto.name}%`),
        role: searchUserDto.role,
      },
      take: 5,
    });
    return searchedUsers;
  }

  async getUserBycode<T>(userCode: number): Promise<T> {
    const user: User = await this.userRepository.findOne({
      where: {
        userCode,
      },
    });
    return <T>user;
  }

  async getInchargeInfoBycode(inChargeCode: number) {
    const inchargeInfo: InChargeInfo =
      await this.inchargeInfoRepository.findOne({
        where: {
          inChargeCode,
        },
      });
    return inchargeInfo;
  }

  async getUserListBycode<T>(userCodeList: number[]) {
    return await Promise.all(
      userCodeList.map(async (userCode) => {
        return await this.getUserBycode<T>(userCode);
      }),
    );
  }

  async findSelfStudyTimeTeachers(
    selfStudyTime: { day: number; date: Date },
    studentList: StudentInfo[],
  ) {
    let studentGradeList: number[] = await Promise.all(
      studentList.map(async (student) => student.grade),
    );
    studentGradeList = [...new Set(studentGradeList)]; // 학생들 학년이 중복제거 된 학년 리스트이다.
    return await Promise.all(
      studentGradeList.map(async (grade) => {
        const teacher = await this.getSelfStudyTimeTeacher(
          grade,
          selfStudyTime.day,
          selfStudyTime.date,
        );
        if (!teacher) {
          const dayList = ['', '월', '화', '수', '목', '금'];
          throw new HttpException(
            `${
              dayList[selfStudyTime.day] + '요일' || selfStudyTime.date
            }에 자습담당선생님을 찾을 수 없습니다.`,
            HttpStatus.NOT_FOUND,
          );
        }
        return teacher;
      }),
    );
  }

  async findHomeRoomTeachers(studentList: StudentInfo[]) {
    const arrUnique = studentList.filter((character, idx, arr) => {
      return (
        arr.findIndex(
          (item) =>
            item.classNo === character.classNo &&
            item.grade === character.grade,
        ) === idx
      );
    });
    return await Promise.all(
      arrUnique.map(async (student) => {
        const teacher = await this.getHomeRoomTeacher(
          student.grade,
          student.classNo,
        );
        if (!teacher) {
          throw new HttpException(
            `${student.grade}학년${student.classNo}반 담임선생님을 찾을 수 없습니다`,
            HttpStatus.NOT_FOUND,
          );
        }
        return teacher;
      }),
    );
  }

  async getDormManagerTeacher() {
    const { teacher } = await this.inchargeInfoRepository.findOne({
      where: {
        inChargeType: InCharge.DORMITORY,
      },
      relations: ['teacher'],
    });
    return teacher;
  }

  async getHomeRoomTeacher(
    inChargeGrade: number,
    inChargeClassNo: number,
  ): Promise<TeacherInfo> {
    const { teacher } = await this.homeRoomRepository.findOne({
      where: {
        classNo: inChargeClassNo,
        gradeNo: inChargeGrade,
      },
      relations: ['teacher'],
    });
    return teacher;
  }

  async getSelfStudyTimeTeacher(
    inChargeGrade: number,
    day: number,
    date: Date,
  ): Promise<TeacherInfo | null> {
    const { teacher } = await this.selfStudyTimeRepository.findOne({
      where: {
        day: date ? null : day,
        date: date ? date : null,
        gradeNo: inChargeGrade,
      },
      relations: ['teacher'],
    });
    return teacher;
  }

  async checkUserListRole(userList: User[], role: BsmOauthUserRole) {
    Promise.all(
      userList.map(async (user) => {
        this.checkUserRole(user, role);
      }),
    );
  }

  checkUserRole(user: User, role: BsmOauthUserRole) {
    if (user.role === role) {
      return true;
    }
    throw new HttpException(
      `${user.userCode}번 유저는 ${role} 역할이 아닙니다`,
      HttpStatus.BAD_GATEWAY,
    );
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

  private async rolePass(user: User, role: BsmOauthUserRole): Promise<void> {
    if (user.role === role) {
      return;
    }
    throw new UnauthorizedException(
      `${user.userCode} user has not ${role} role`,
    );
  }
}
