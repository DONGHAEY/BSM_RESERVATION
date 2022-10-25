import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RequestInfo } from './entity/RequestInfo.entity';
import { Repository } from 'typeorm';
import { RequestMember } from './entity/RequestMember.entity';
import { RoomService } from 'src/room/room.service';
import { RequestReservationDto } from 'src/room/dto/requestReservation.dto';
import { UserService } from 'src/user/user.service';
import BsmOauth, { BsmOauthUserRole } from 'bsm-oauth';
import { User } from 'src/user/entity/User.entity';
import { TeacherInfo } from 'src/user/entity/TeacherInfo.entity';
import { InCharge } from 'src/user/types/InCharge.type';
import { StudentInfo } from 'src/user/entity/StudentInfo.entity';
import { EntryAvailable } from 'src/room/entity/EntryAvailable.entity';
import { ResponseMember } from './entity/ResponseMember.entity';

@Injectable()
export class MovingCertificationService {
  constructor(
    private roomService: RoomService,
    private userService: UserService,
    @InjectRepository(RequestInfo)
    private requestInfoRepository: Repository<RequestInfo>,
    @InjectRepository(RequestMember)
    private requestMemberRepository: Repository<RequestMember>,
    @InjectRepository(ResponseMember)
    private responseMemberRepository: Repository<ResponseMember>,
  ) {}

  //만들어야할 메서드 정리
  // 1. 요청하기 기능
  async requestRoom(request: RequestReservationDto) {
    // 1-1 요청하는 사항의 시간대가 사용중인지, 예약이 되어있는지 확인한다.
    const todayDate = new Date();
    const isRequestInfo = await this.getRequestBycodeAndDate(
      request.entryAvailableCode,
      todayDate,
    );
    if (isRequestInfo) {
      throw new HttpException(
        '이미 예약이 된 항목입니다.',
        HttpStatus.BAD_GATEWAY,
      );
    }
    // 1. 학생이 이석 요청 시, 요청하는 날짜와 요청하는 사항의 날짜가 일치하는지 확인한다.
    const entryAvailable = await this.roomService.getEntryAvailableInfoBycode(
      request.entryAvailableCode,
    );
    if (entryAvailable.day !== todayDate.getDay()) {
      throw new HttpException(
        '오늘 항목만 예약 할 수 있습니다',
        HttpStatus.BAD_GATEWAY,
      );
    }
    // 2. 함께하고자 하는 학생들이 모두 학생인지 확인한다.
    request.userCodeList.map(async (userCode) => {
      const user: User = await this.userService.getUserBycode(userCode);
      if (user.role !== BsmOauthUserRole.STUDENT) {
        throw new HttpException(
          `${userCode} user는 학생이 아니어서 예약 할 수 없습니다.`,
          HttpStatus.BAD_REQUEST,
        );
      }
    });
    //학생수가 입장가능 정보의 최소인원, 최대인원을 만족하는지 확인한다.
    const numOfMember = request.userCodeList.length;

    if (entryAvailable.minOcc > numOfMember) {
      throw new HttpException(
        `최소인원을 충족해야합니다 ${
          entryAvailable.minOcc - numOfMember
        }명이 더 필요합니다`,
        HttpStatus.BAD_REQUEST,
      );
    }
    if (entryAvailable.maxOcc < numOfMember) {
      throw new HttpException(
        `최대 인원을 만족해야합니다 ${
          numOfMember - entryAvailable.maxOcc
        }명이 더 줄어야합니다`,
        HttpStatus.BAD_REQUEST,
      );
    }
    // 3. 학생이 현재 사용하고자 하는 항목이 어떤 타입의 선생님에게 요청해야하는지 확인한다.
    const teacherList: TeacherInfo[] = await this.findRequestTeachers(
      entryAvailable,
      request.userCodeList,
    );
    //요청사항을 저장
    const { requestCode } = await this.requestInfoRepository.save({
      entryAvailableCode: request.entryAvailableCode,
    });
    // 요청하는 학생들을 저장
    request.userCodeList.map(async (userCode) => {
      await this.requestMemberRepository.save({
        requestCode,
        userCode,
      });
    });
    // 요청받는 선생님을 저장
    teacherList.map(async (teacher) => {
      await this.responseMemberRepository.save({
        requestCode,
        userCode: teacher.userCode,
      });
    });
    //알림을 보낸다
  }

  private async findRequestTeachers(
    entryAvailable: EntryAvailable,
    userCodeList: number[],
  ): Promise<any> {
    let teacherList: TeacherInfo[] = []; //
    if (entryAvailable.reqTo === InCharge.SELFSTUDYTIME) {
      //SELFSTUDY TIME 담당 선생님인 경우
      let studentGradeList: number[] = [];
      studentGradeList = [...new Set(userCodeList)]; // 학생들의 중복제거 된 학년 리스트
      studentGradeList.map(async (grade) => {
        const teacher = await this.userService.findSelfStudyTimeTeacher(
          grade,
          entryAvailable.day,
          entryAvailable.date,
        );
        if (teacher) {
          //서비스 초기 단계 서비스 진행위해 선생님 한 분 이라도 있으면 진행 할 수 있도록 한다.
          teacherList.push(teacher);
        }
      });
    }
    if (entryAvailable.reqTo === InCharge.HOMEROOM) {
      throw new HttpException('준비 중 입니다', HttpStatus.AMBIGUOUS);
    }
    if (entryAvailable.reqTo === InCharge.DORMITORY) {
      throw new HttpException('준비 중 입니다', HttpStatus.AMBIGUOUS);
    }
    if (!teacherList.length) {
      throw new HttpException(
        '요청을 받을 수 있는 선생님이 한분도 없습니다.',
        HttpStatus.BAD_REQUEST,
      );
    }
    return teacherList;
  }

  private async getRequestBycodeAndDate(code: number, date: Date) {
    return await this.requestInfoRepository.save({
      requestCode: code,
      date,
    });
  }
}
