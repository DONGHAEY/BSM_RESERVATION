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
import { TaskService } from 'src/task/task.service';
import { ResponseReservationDto } from 'src/moving-certification/dto/responseReservation.dto';
import { ResponseType } from './types/response.type';
import { RequestInfoRepository } from './repository/RequestInfoRepository';
import { ResponseMemberRepository } from './repository/ResponseMemberRepository';
import { EntryAvailableRepository } from 'src/room/repository/EntryAvailable.repository';
import { RequestMemberRepository } from './repository/RequestMemberRepository';

@Injectable()
export class MovingCertificationService {
  constructor(
    private taskServie: TaskService,
    private roomService: RoomService,
    private userService: UserService,
    private requestInfoRepository: RequestInfoRepository,
    private responseMemberRepository: ResponseMemberRepository,
    private requestMemberRepository: RequestMemberRepository,
    private entryAvailableRepository: EntryAvailableRepository,
  ) {}

  //요청 응답하기 기능 //
  async responseRoom(
    teacherInfo: TeacherInfo,
    response: ResponseReservationDto,
  ) {
    const requestInfo: RequestInfo =
      await this.requestInfoRepository.getRequestByCode(response.requestCode, [
        'entryAvailableInfo',
        'responseMembers',
        'requestMembers',
      ]);
    if (!requestInfo) {
      throw new HttpException('그런 항목은 없습니다', HttpStatus.NOT_FOUND);
    }
    let { entryAvailableInfo, responseMembers, requestMembers } = requestInfo;
    //현재 선생님이 응답할 권한이 있는지 확인한다.
    await this.responseMemberRepository.checkTeacherInResponseMember(
      responseMembers,
      teacherInfo,
    );
    //응답할 수 있는 요청인지 확인한다.
    await this.requestInfoRepository.checkCanResponse(requestInfo);
    // 현재 올바른 시간의 항목을 승인하는지 확인한다. //
    await this.entryAvailableRepository.checkEntryTime(entryAvailableInfo);
    //현재 응답하는 선생님의 응답정보를 무응답에서 해당하는 응답 타입으로 업데이트 시킨다.
    const myResponse: ResponseMember =
      await this.responseMemberRepository.updateResponseType(
        requestInfo.requestCode,
        teacherInfo.userCode,
        response.responseType,
      );
    // 요청을 타입에 따라 응답한다. //
    responseMembers = responseMembers.filter(
      (responseMember) => responseMember.userCode !== teacherInfo.userCode,
    );
    responseMembers.push(<ResponseMember>myResponse);
    if (response.responseType === ResponseType.APPROVE) {
      //만약 모든 선생님이 승인을 했다면.. //
      if (
        responseMembers.every(
          (responseMember) =>
            responseMember.responseType === ResponseType.APPROVE,
        )
      ) {
        // '요청 항목'을 허용되었음으로 업데이트한다. //
        await this.requestInfoRepository.updateRequestAccByCode(
          requestInfo.requestCode,
          isAccType.ALLOWED,
        );
        // 만약 현재시간이 이미 입장 가능 시간이 지났다면 바로 사용 중으로 업데이트시키고, 아니라면 입장 가능 시간에 문을 사용중으로 업데이트 시킨다.
        await this.roomService.setRoomUsingStatus(
          entryAvailableInfo,
          requestInfo,
        );
      }
    }
    // 알림을 보낸다 //
  }

  // 방 요청하기 기능  //
  async requestRoom(request: RequestReservationDto) {
    const entryAvailable = await this.roomService.getEntryAvailableInfoBycode(
      request.entryAvailableCode,
    );
    // 학생이 요청한 항목이 존재하는지 확인한다.
    if (!entryAvailable) {
      throw new HttpException('그런 항목은 없습니다', HttpStatus.NOT_FOUND);
    }
    // 요청하는 사람이 이미 사용중인 방이 있는지도 확인해야한다. //
    // 입장 가능한 시간인지 확인한다. //
    await this.entryAvailableRepository.checkEntryTime(entryAvailable);
    // 요청하는 사항의 항목이 현재 요청이 가능한지 확인한다. 이미 사용중인지, 예약 대기자가 있는지 확인한다. //
    await this.requestInfoRepository.checkCanRequest(
      entryAvailable.entryAvailableCode,
    );
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
    await this.entryAvailableRepository.checkCapacity(
      studentList,
      entryAvailable,
    );
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
        const { isAcc } = await this.requestInfoRepository.getRequestByCode(
          requestCode,
        );
        if (isAcc === isAccType.WATING) {
          await this.requestInfoRepository.updateRequestAccByCode(
            requestCode,
            isAccType.DENIED,
          );
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
      teacherList = await this.userService.findSelfStudyTimeTeachers(
        { day: entryAvailable.day, date: entryAvailable.date },
        studentList,
      );
    }
    if (entryAvailable.reqTo === InCharge.HOMEROOM) {
      //각 담임선생님에게 요청할 때 에는 (학년, 반)이 중복되지 않아야함.
      teacherList = await this.userService.findHomeRoomTeachers(studentList);
    }
    if (entryAvailable.reqTo === InCharge.DORMITORY) {
      teacherList[0] = await this.userService.getDormManagerTeacher();
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
  // * 요청이 현재 활성화 되어있는 상태인지 확인한다. * //
  //** 학생들이 요청을 하기위해 사용되는 메서드 이다, 예약하려는 항목에 대하여 요청전의 가장 최근 요청을 확인하여 예약을 할 수 있는지 체크하는 메서드이다. **//
}
