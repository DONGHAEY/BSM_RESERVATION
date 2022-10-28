import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { RoomService } from 'src/room/room.service';
import { RequestReservationDto } from './dto/requestReservation.dto';
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
import { ResponseReservationDto } from 'src/moving-certification/dto/responseReservation.dto';
import { ResponseType } from './types/response.type';
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

  //요청 응답하기 기능 //
  async responseRoom(
    teacherInfo: TeacherInfo,
    response: ResponseReservationDto,
  ) {
    const requestInfo: RequestInfo = await this.getRequestByCode(
      response.requestCode,
      ['entryAvailableInfo', 'responseMembers'],
    );
    const { entryAvailableInfo, responseMembers } = requestInfo;

    const isTeacher = responseMembers.find(
      (responseMember) => responseMember.userCode === teacherInfo.userCode,
    );
    // 요청 정보에 현재 응답하는 선생님 정보가 포함되어있는지 확인한다.
    if (!isTeacher) {
      throw new HttpException(
        '요청에 응답할 수 있는 권한이 없습니다',
        HttpStatus.FORBIDDEN,
      );
    }
    // 요청이 현재 활성화 되어있는지 확인한다. ex)요청이 이미 거부 되어있거나, 시간이 지나있는 경우 //
    if (requestInfo.isAcc === isAccType.DENIED) {
      throw new HttpException(
        '이미 거부된 요청입니다.',
        HttpStatus.BAD_REQUEST,
      );
    }
    // 현재 올바른 항목을 승인하는지 확인해야한다 //
    await this.checkEntryTime(entryAvailableInfo);
    // 요청을 타입에 따라 응답한다. //
    await this.updateResponseType(
      requestInfo.requestCode,
      teacherInfo.userCode,
      response.responseType,
    );

    //
    if (response.responseType === ResponseType.APPROVE) {
      // 응답 개수가 요청된 선생님들의 수와 같다면 해당 요청 항목이 허용되었음으로 업데이트 한다. //
      // 다음으로 방을 사용중으로 업데이트한다.//
      // 응답 후 10분후에 확인하는 함수를 실행한다 //
    }
    if (response.responseType === ResponseType.REJECT) {
    }
    // 알림을 보낸다 //
  }
  //만들어야할 메서드 정리
  // 방 요청하기 기능  //
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
    // 요청하는 사항의 항목이 사용중인지 확인한다. //
    await this.checkLastRequestInfo(entryAvailable.entryAvailableCode);
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
    // 학생수가 입장가능 정보의 최소인원, 최대인원을 만족하는지 확인해야한다. //
    await this.checkCapacity(studentList, entryAvailable);
    // 학생이 현재 사용하고자 하는 항목의 요청 타입에 따라 요청 할 선생님들을 불러온다. //
    const teacherList: TeacherInfo[] = await this.findRequestTeachers(
      entryAvailable,
      studentList,
    );
    //요청사항을 저장 //
    const { requestCode } = await this.requestInfoRepository.save({
      entryAvailableCode: request.entryAvailableCode,
    });

    // 요청하는 학생들을 저장 한다. //
    await Promise.all(
      request.userCodeList.map(async (userCode) => {
        await this.requestMemberRepository.save({
          requestCode,
          userCode,
        });
      }),
    );
    // 요청받는 선생님을 저장 한다. //
    await Promise.all(
      teacherList.map(async (teacher) => {
        await this.responseMemberRepository.save({
          requestCode,
          userCode: teacher.userCode,
        });
      }),
    );
    // 10분뒤에 스케줄려로 + 승인이 되었는지 확인하고 승인이 되지 않았다면, 거부됨으로 업데이트시킨다. //
    this.taskServie.addNewTimeout(
      `${requestCode}-check-request-acc`,
      1000 * 60 * 10,
      async () => {
        const { isAcc } = await this.getRequestByCode(requestCode);
        if (isAcc === isAccType.WATING) {
          await this.updateRequestAccByCode(requestCode, isAccType.DENIED);
        }
      },
      // 시간이 지나도 승인이 되지 않아 거부가 되었다고 알림을 발송한다.. //
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
        '오늘 항목만 진행 할 수 있습니다.',
        HttpStatus.BAD_GATEWAY,
      );
    }
    // 항목 시간이 지금시간과 비교해서 이미 지나간 항목은 아닌지도 확인한다. //
    let hour: number = parseInt(entryAvailable.closeAt.substring(0, 2));
    let min: number = parseInt(entryAvailable.closeAt.substring(2, 4));
    let nowHour: number = todayDate.getHours();
    let nowMin: number = todayDate.getMinutes();
    if (hour < nowHour && min - 10 < nowMin) {
      throw new HttpException(
        '이미 시간이 지나가서 진행 할 수 없습니다',
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  // * 요청이 현재 활성화 되어있는 상태인지 확인한다. * //

  //** 학생들이 요청을 하기위해 사용되는 메서드 이다, 지금 요청전의 가장 최근 요청을 확인하여 예약을 할 수 있는지 체크하는 메서드이다. **//
  private async checkLastRequestInfo(
    entryAvailableCode: number,
  ): Promise<void> {
    //요청 했었던 모든 정보중 최신 정보를 불러온다.
    const lastRequest = await this.getRecentTodayRequest(entryAvailableCode);
    if (!lastRequest) return;
    const { isAcc } = lastRequest;
    // const todayDate = new Date();
    // if (requestWhen.toLocaleDateString() !== todayDate.toLocaleDateString())
    //   return;
    if (isAcc === isAccType.ALLOWED) {
      throw new HttpException(
        '이미 예약이 된 항목이라 진행 할 수 없습니다',
        HttpStatus.FORBIDDEN,
      );
    }
    return;
  }

  private async checkCapacity(
    studentList: StudentInfo[],
    entryAvailable: EntryAvailable,
  ): Promise<void> {
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

  /** 오늘 가장 최근의 요청정보를 불러오는 메서드이다. **/
  private async getRecentTodayRequest(
    entryAvailableCode: number,
    relationOptions: string[] = [],
  ) {
    return await this.requestInfoRepository.findOne({
      where: {
        entryAvailableCode,
        requestWhen: MoreThan(
          new Date(
            `${new Date().toISOString().substring(0, 10)}T00:00:00.000Z`,
          ),
        ),
      },
      order: {
        requestWhen: 'DESC',
      },
      relations: relationOptions,
    });
  }

  private async getRequestByCode(
    requestCode: number,
    relationOptions: string[] = [],
  ) {
    return await this.requestInfoRepository.findOne({
      where: {
        requestCode,
      },
      relations: relationOptions,
    });
  }

  private async updateResponseType(
    requestCode: number,
    userCode: number,
    responseType: ResponseType,
  ) {
    return await this.responseMemberRepository.update(
      {
        requestCode,
        userCode,
      },
      {
        responseType,
      },
    );
  }

  private async updateRequestAccByCode(
    requestCode: number,
    isAccType: isAccType,
  ) {
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
