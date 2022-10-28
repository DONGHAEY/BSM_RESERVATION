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
import { SchedulerRegistry } from '@nestjs/schedule';
import { TaskService } from 'src/task/task.service';
@Injectable()
export class MovingCertificationService {
  constructor(
    private taskServie: TaskService,
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
    const entryAvailable = await this.roomService.getEntryAvailableInfoBycode(
      request.entryAvailableCode,
    );

    // 학생이 요청한 항목이 존재하는지 확인한다.
    if (!entryAvailable) {
      throw new HttpException('그런 항목은 없습니다', HttpStatus.NOT_FOUND);
    }

    // 입장 가능한 시간인지 확인한다. //
    await this.checkEntryTime(entryAvailable);

    // 요청하는 사항의 항목이 사용중인지, 예약이 되어있는지 확인한다. //
    await this.checkExsistRequestInfo(entryAvailable.entryAvailableCode);

    // 받은 유저 코드 리스트를 통해 유저정보를 리스트로 불러온다. //
    const studentList: StudentInfo[] =
      await this.userService.getUserListBycode<StudentInfo>(
        request.userCodeList,
      );
    // 요청하는 유저 리스트의 유저 역할이 모두 학생인지 확인한다. //
    await this.userService.checkUserListRole(
      studentList,
      BsmOauthUserRole.STUDENT,
    );
    // 학생수가 입장가능 정보의 최소인원, 최대인원을 만족하는지 확인해야한다.
    await this.checkCapacity(studentList, entryAvailable);
    // 학생이 현재 사용하고자 하는 항목의 요청 타입에 따라 요청 할 선생님들을 불러온다.
    const teacherList: TeacherInfo[] = await this.findRequestTeachers(
      entryAvailable,
      studentList,
    );
    //요청사항을 저장
    const { requestCode } = await this.requestInfoRepository.save({
      entryAvailableCode: request.entryAvailableCode,
    });

    // 요청하는 학생들을 저장 한다.
    await Promise.all(
      request.userCodeList.map(async (userCode) => {
        await this.requestMemberRepository.save({
          requestCode,
          userCode,
        });
      }),
    );
    // 요청받는 선생님을 저장 한다.
    await Promise.all(
      teacherList.map(async (teacher) => {
        await this.responseMemberRepository.save({
          requestCode,
          userCode: teacher.userCode,
        });
      }),
    );
    // 10분뒤에 스케줄려로 + 승인이 되었는지 확인하고 승인이 되지 않았다면, 거부됨으로 업데이트시킨다.
    this.taskServie.addNewTimeout(
      `${requestCode}-check-request-acc`,
      1000 * 60 * 10,
      async () => {
        const { isAcc } = await this.getRequestByCode(requestCode);
        if (isAcc === isAccType.WATING) {
          await this.updateRequestByCode(requestCode, isAccType.DENIED);
        }
      },
      //시간이 지나도 승인이 되지 않아 거부가 되었다고 알림을 발송한다..
    );
  }

  //** 입장가능 정보에 요청타입에 따라 학생정보를 토대로 선생님들을 찾는 메서드이다. **//
  private async findRequestTeachers(
    entryAvailable: EntryAvailable,
    studentList: StudentInfo[],
  ): Promise<TeacherInfo[]> {
    let teacherList: TeacherInfo[] = []; //서비스 초기 단계 서비스 진행위해 선생님 한 분 이라도 있으면 진행 할 수 있도록 한다.
    if (entryAvailable.reqTo === InCharge.SELFSTUDYTIME) {
      let studentGradeList: number[] = await Promise.all(
        studentList.map(async (student) => student.grade),
      );
      studentGradeList = [...new Set(studentGradeList)]; // 학생들 학년이 중복제거 된 학년 리스트이다.
      teacherList = await this.userService.findSelfStudyTimeTeachers(
        entryAvailable,
        studentGradeList,
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

  //** 현재 시간이 입장가능한지 체크하는 메서드이다. **//
  private async checkEntryTime(entryAvailable: EntryAvailable) {
    const todayDate: Date = new Date();
    //오늘 요일과 일치하는지 확인한다. //
    if (entryAvailable.day !== todayDate.getDay()) {
      throw new HttpException(
        '오늘 항목만 예약 할 수 있습니다',
        HttpStatus.BAD_GATEWAY,
      );
    }
    // 항목 시간이 지금시간과 비교해서 이미 지나간 항목은 아닌지도 확인한다. //
    let hour: number = parseInt(entryAvailable.openAt.substring(0, 2));
    let min: number = parseInt(entryAvailable.openAt.substring(2, 4));
    let nowHour: number = todayDate.getHours();
    let nowMin: number = todayDate.getMinutes();
    if (hour < nowHour && min < nowMin) {
      throw new HttpException(
        '이미 시간이 지나가서 예약 할 수 없습니다',
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  //** 최근 지금 요청전의 가장 최근 요청을 확인하여 예약을 할 수 있는지 체크하는 메서드이다. **//
  private async checkExsistRequestInfo(
    entryAvailableCode: number,
  ): Promise<void> {
    const todayDate = new Date();
    const lastRequestInfo = await this.getLastRequestByentryAvailablecode(
      entryAvailableCode,
    ); //요청 했었던 모든 정보중 최신 정보를 불러온다.

    // 만약 그항목에 대한 다른 요청이 있었다면, 승인이 되었는지의 여부를 확인한다.
    if (lastRequestInfo && lastRequestInfo.isAcc === isAccType.ALLOWED) {
      throw new HttpException(
        '이미 승인 완료된 항목입니다.',
        HttpStatus.BAD_GATEWAY,
      );
    }
    // 만약 그 항목에 대한 대기중인 다른 최근 요청이 있었다면, 그 최근요청이 10분이 지났는지 확인한다.
    if (lastRequestInfo && lastRequestInfo.isAcc === isAccType.WATING) {
      if (
        !(
          todayDate.getTime() - lastRequestInfo.requestWhen.getTime() >
          1000 * 60 * 10
        )
      ) {
        //최근에 있었던 요청이 대기상태로 10분이 지나지 않은 경우 처리된다.
        throw new HttpException(
          '이미 예약이 누군가에 의해 대기중인 항목입니다.',
          HttpStatus.BAD_GATEWAY,
        );
      }
    }
  }

  private async checkCapacity(
    studentList: StudentInfo[],
    entryAvailable: EntryAvailable,
  ) {
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
  }

  /** 가장 최근의 요청정보를 불러오는 메서드이다. **/
  private async getLastRequestByentryAvailablecode(entryAvailableCode: number) {
    return await this.requestInfoRepository.findOne({
      where: {
        entryAvailableCode,
      },
      order: {
        requestWhen: 'DESC',
      },
    });
  }

  private async getRequestByCode(requestCode: number) {
    return await this.requestInfoRepository.findOne({
      where: {
        requestCode,
      },
    });
  }

  private async updateRequestByCode(requestCode: number, isAccType: isAccType) {
    return await this.requestInfoRepository.update(
      {
        requestCode,
      },
      {
        isAcc: isAccType,
      },
    );
  }
}
