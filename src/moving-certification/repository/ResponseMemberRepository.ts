import { HttpException, HttpStatus } from '@nestjs/common';
import { CustomRepository } from 'src/custom-repository/CustomRepository.decorator';
import { TeacherInfo } from 'src/user/entity/TeacherInfo.entity';
import { Repository, MoreThan } from 'typeorm';
import { ResponseMember } from '../entity/ResponseMember.entity';
import { ResponseType } from '../types/response.type';

@CustomRepository(ResponseMember)
export class ResponseMemberRepository extends Repository<ResponseMember> {
  async updateResponseType(
    requestCode: number,
    userCode: number,
    responseType: ResponseType,
  ): Promise<any> {
    return await this.update(
      {
        requestCode,
        userCode,
      },
      {
        responseType,
      },
    );
  }

  async checkTeacherIsInMembers(
    responseMembers: ResponseMember[],
    teacherInfo: TeacherInfo,
  ) {
    const isTeacher = responseMembers.find(
      (responseMember) => responseMember.userCode === teacherInfo.userCode,
    );
    // 요청 정보에 현재 응답하는 선생님 정보가 포함되어있는지 확인한다.
    if (!isTeacher) {
      throw new HttpException(
        '응답 멤버 리스트에 당신이 포함되어있지 않기 때문에, 요청에 응답할 수 있는 권한이 없습니다.',
        HttpStatus.FORBIDDEN,
      );
    }
  }
}
