import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoomService } from 'src/room/room.service';
import { RequestReservationDto } from 'src/room/dto/requestReservation.dto';
import { UserService } from 'src/user/user.service';
import BsmOauth, { BsmOauthUserRole } from 'bsm-oauth';
import { User } from 'src/user/entity/User.entity';
import { TeacherInfo } from 'src/user/entity/TeacherInfo.entity';
import { InCharge } from 'src/user/types/InCharge.type';
import { StudentInfo } from 'src/user/entity/StudentInfo.entity';
import { EntryAvailable } from 'src/room/entity/EntryAvailable.entity';
import { isAccType } from './types/isAcc.type';
import { RequestInfo } from './entity/RequestInfo.entity';
import { RequestMember } from './entity/RequestMember.entity';
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
  // 1. 요청하기 기능 //
  async requestRoom(request: RequestReservationDto) {
    const todayDate: Date = new Date();
    // 1-1 요청하는 사항의 시간대가 사용중인지, 예약이 되어있는지 확인한다.
    console.log('되는지 확인1');
    const isRequestInfo = await this.getLastRequestByentryAvailablecode(
      request.entryAvailableCode,
    ); //요청 했었던 모든 정보중 최신 정보를 불러온다.
    console.log('되는지 확인2');
    // 만약 그항목에 대한 다른 요청이 있었다면, 승인이 되었는지의 여부를 확인한다.
    if (isRequestInfo && isRequestInfo.isAcc === isAccType.ALLOWED) {
      throw new HttpException(
        '이미 예약이 승인 완료된 항목입니다.',
        HttpStatus.BAD_GATEWAY,
      );
    }
    console.log('되는지 확인3');
    // 만약 그 항목에 대한 대기중인 다른 최근 요청이 있었다면, 그 최근요청이 10분이 지났는지 확인한다.
    if (isRequestInfo && isRequestInfo.isAcc === isAccType.WATING) {
      if (
        !(
          todayDate.getTime() - isRequestInfo.requestWhen.getTime() >
          60 * 60 * 10
        )
      ) {
        //최근에 있었던 요청이 대기상태로 10분이 지나지 않은 경우
        throw new HttpException(
          '이미 예약이 누군가에 의해 대기중인 항목입니다.',
          HttpStatus.BAD_GATEWAY,
        );
      }
    }
    console.log('되는지 확인4');
    // 1. 학생이 이석 요청 시, 요청하는 날짜와 요청하는 사항의 날짜가 일치하는지 확인한다.
    const entryAvailable = await this.roomService.getEntryAvailableInfoBycode(
      request.entryAvailableCode,
    );
    if (!entryAvailable) {
      throw new HttpException('그런 항목은 없습니다', HttpStatus.NOT_FOUND);
    }
    if (entryAvailable.day !== todayDate.getDay()) {
      throw new HttpException(
        '오늘 항목만 예약 할 수 있습니다',
        HttpStatus.BAD_GATEWAY,
      );
    }
    //또 예약하는 항목이 시간이 이미 지나간 항목은 아닌지도 확인해야한다.
    console.log('되는지 확인5');
    // 2. 함께하고자 하는 학생들이 모두 학생인지 확인한다.
    const studentList: StudentInfo[] = await this.userService.getUserListBycode(
      request.userCodeList,
    );
    await this.userService.checkUserListRole(
      studentList,
      BsmOauthUserRole.STUDENT,
    );
    console.log('되는지 확인6');
    //학생수가 입장가능 정보의 최소인원, 최대인원을 만족하는지 확인한다.
    const numOfMember = studentList.length;

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
    console.log('되는지 확인7');
    // 3. 학생이 현재 사용하고자 하는 항목이 어떤 타입의 선생님에게 요청해야하는지 확인한다.
    const teacherList: TeacherInfo[] = await this.findRequestTeachers(
      entryAvailable,
      studentList,
    );
    console.log('dd');
    //요청사항을 저장
    const { requestCode } = await this.requestInfoRepository.save({
      entryAvailableCode: request.entryAvailableCode,
    });

    // 요청하는 학생들을 저장
    await Promise.all(
      request.userCodeList.map(async (userCode) => {
        await this.requestMemberRepository.save({
          requestCode,
          userCode,
        });
      }),
    );
    // 요청받는 선생님을 저장
    await Promise.all(
      teacherList.map(async (teacher) => {
        await this.responseMemberRepository.save({
          requestCode,
          userCode: teacher.userCode,
        });
      }),
    );
    //알림을 보낸다
  }

  private async findRequestTeachers(
    entryAvailable: EntryAvailable,
    studentList: StudentInfo[],
  ): Promise<any> {
    let teacherList = []; //서비스 초기 단계 서비스 진행위해 선생님 한 분 이라도 있으면 진행 할 수 있도록 한다.
    if (entryAvailable.reqTo === InCharge.SELFSTUDYTIME) {
      //SELFSTUDY TIME 담당 선생님인 경우
      let studentGradeList: number[] = await Promise.all(
        studentList.map(async (student) => student.grade),
      );
      studentGradeList = [...new Set(studentGradeList)]; // 학생들의 중복제거 된 학년 리스트
      teacherList = await Promise.all(
        studentGradeList.map(async (grade) => {
          const teacher = await this.userService.findSelfStudyTimeTeacher(
            grade,
            entryAvailable.day,
            entryAvailable.date,
          );
          if (teacher) {
            return teacher;
          }
        }),
      );
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

  private async getLastRequestByentryAvailablecode(entryAvailableCode: number) {
    return await this.requestInfoRepository.findOne({
      where: {
        entryAvailableCode,
      },
      order: {
        requestWhen: 'desc',
      },
    });
  }
}
