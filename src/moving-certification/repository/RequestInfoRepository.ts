import { HttpException, HttpStatus } from '@nestjs/common';
import { CustomRepository } from 'src/custom-repository/CustomRepository.decorator';
import { Repository, MoreThan } from 'typeorm';
import { RequestInfo } from '../entity/RequestInfo.entity';
import { RequestMember } from '../entity/RequestMember.entity';
import { ResponseMember } from '../entity/ResponseMember.entity';
import { isAccType } from '../types/isAcc.type';

@CustomRepository(RequestInfo)
export class RequestInfoRepository extends Repository<RequestInfo> {
  async getRequestByCode(requestCode: number, relationOptions: string[] = []) {
    return await this.findOne({
      where: {
        requestCode,
      },
      relations: relationOptions,
    });
  }

  async checkCanRequest(entryAvailableCode: number): Promise<void> {
    //요청 했었던 모든 정보중 최신 정보를 불러온다.
    const isAllowedRequest = await this.getTodayRequest(
      entryAvailableCode,
      isAccType.ALLOWED,
    );
    const isWatingRequest = await this.getTodayRequest(
      entryAvailableCode,
      isAccType.WATING,
    );
    if (isAllowedRequest) {
      throw new HttpException(
        '이미 예약이 된 항목이라 진행 할 수 없습니다',
        HttpStatus.FORBIDDEN,
      );
    }
    if (isWatingRequest) {
      throw new HttpException(
        '예약이 누군가에게 의해 대기중입니다 - 예약이 10분뒤에도 승인되지 않거나, 거부된다면 다시 요청 할 수 있습니다',
        HttpStatus.FORBIDDEN,
      );
    }
  }

  async checkCanResponse(requestInfo: RequestInfo) {
    // 요청이 현재 활성화 되어있는지 확인한다. ex)요청이 이미 거부 되어있거나, 시간이 지나있는 경우 //
    if (requestInfo.isAcc === isAccType.DENIED || isAccType.ALLOWED) {
      throw new HttpException(
        '이미 처리된 요청입니다.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async updateRequestAccByCode(requestCode: number, isAccType: isAccType) {
    return await this.update(
      {
        requestCode,
      },
      {
        isAcc: isAccType,
      },
    );
  }
  async getTodayRequest(entryAvailableCode: number, isAcc: isAccType) {
    return await this.findOne({
      where: {
        entryAvailableCode,
        requestWhen: MoreThan(
          new Date(
            `${new Date().toISOString().substring(0, 10)}T00:00:00.000Z`,
          ),
        ),
        isAcc,
      },
    });
  }

  async getStudentRequestList(studentUserCode: number, isAcc: isAccType) {
    // 1. TypeORM query builder를 통해, 학생이 요청 한 것들 중, WATING인 것들만 반환하는 메서드 //
    let myRequestList = await this.createQueryBuilder()
      .select('RequestInfo.requestCode', 'requestCode')
      .where(`isAcc='${isAcc}'`)
      .leftJoin(
        (qb) =>
          qb
            .from(RequestMember, 'RequestMember')
            .select()
            .where(`userCode=${studentUserCode}`),
        'L',
        'RequestInfo.requestCode = L.requestCode',
      )
      .getRawMany();

    return await Promise.all(
      myRequestList.map(async ({ requestCode }) => {
        return await this.getRequestByCode(requestCode, [
          'requestMembers',
          'responseMembers',
        ]);
      }),
    );
  }

  async getRecievedRequestList(teacherUserCode: number, isAcc: isAccType) {
    // 1. TypeORM query builder를 통해, 선생님이 요청 받은 것들 중, WATING인 것들만 반환하는 메서드
    // select request.requestCode from responseMember, request where userCode = 103 and request.requestCode = responseMember.requestCode and isAcc = isAcc;
    let requestList = await this.createQueryBuilder()
      .select('RequestInfo.requestCode', 'requestCode')
      .where(`isAcc='${isAcc}'`)
      .leftJoin(
        (qb) =>
          qb
            .from(ResponseMember, 'ResponseMember')
            .select()
            .where(`userCode=${teacherUserCode}`),
        'L',
        'RequestInfo.requestCode = L.requestCode',
      )
      .getRawMany();

    return await Promise.all(
      requestList.map(async ({ requestCode }) => {
        return await this.getRequestByCode(requestCode, [
          'requestMembers',
          'responseMembers',
        ]);
      }),
    );
  }
}
