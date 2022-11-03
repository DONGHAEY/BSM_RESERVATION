import { HttpException, HttpStatus } from '@nestjs/common';
import { CustomRepository } from 'src/custom-repository/CustomRepository.decorator';
import { EntryAvailable } from 'src/room/entity/EntryAvailable.entity';
import { Repository, MoreThan, Between } from 'typeorm';
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

  private async getTodayRequest(entryAvailableCode: number, isAcc: isAccType) {
    const today0oclock: Date = new Date();
    today0oclock.setHours(0, 0, 0, 0);
    return await this.findOne({
      where: {
        entryAvailableCode,
        requestWhen: MoreThan(today0oclock),
        isAcc,
      },
    });
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

  async getMyRequestList(
    //객체로 받아오기
    //user가 있는지 확인하기
    {
      userCode,
      isAcc = null,
      startDate = null,
      endDate = null,
      page = 0,
    }: {
      userCode: number;
      isAcc: isAccType | null;
      startDate: Date | null;
      endDate: Date | null;
      page: number;
    },
  ) {
    // 1. TypeORM query builder를 통해, 학생이 요청 한 것들 중, WATING인 것들만 반환하는 메서드 //
    let myRequestList = await this.createQueryBuilder()
      .select('RequestInfo.requestCode', 'requestCode')
      .where(startDate ? `requestWhen >= :startDate` : null, {
        startDate,
      })
      .andWhere(endDate ? `requestWhen < :endDate` : null, {
        endDate,
      })
      .andWhere(isAcc ? `isAcc='${isAcc}'` : ``)
      .leftJoin(
        (qb) =>
          qb
            .from(RequestMember, 'RequestMember')
            .select()
            .where(`userCode=${userCode}`),
        'L',
        'RequestInfo.requestCode = L.requestCode',
      )
      .orderBy(`RequestInfo.requestWhen`, 'DESC')
      .take(page ? 10 : null)
      .skip(page ? page - 1 : null)
      .getRawMany();

    return await Promise.all(
      myRequestList.map(async ({ requestCode }) => {
        return await this.getRequestByCode(requestCode);
      }),
    );
  }

  async getRecievedRequestList(
    //객체로 받아오기
    // 그리고 startDate, endDate 추가하기 //startDate가 값이 없다면 월요일, endDate가 값이 없다면 지금으로 기본값 설정하기
    {
      userCode,
      isAcc = null,
      startDate = null,
      endDate = null,
      page = 0,
      relationOptions = [],
    }: {
      userCode: number;
      isAcc: isAccType | null;
      startDate: Date | null;
      endDate: Date | null;
      page: number;
      relationOptions: string[];
    },
  ) {
    // 1. TypeORM query builder를 통해, 선생님이 요청 받은 것들 중, WATING인 것들만 반환하는 메서드
    // select request.requestCode from responseMember, request where userCode = 103 and request.requestCode = responseMember.requestCode and isAcc = isAcc;
    let requestList = await this.createQueryBuilder()
      .select('RequestInfo.requestCode', 'requestCode')
      .where(startDate ? `requestWhen >= :startDate` : null, {
        startDate,
      })
      .andWhere(endDate ? `requestWhen < :endDate` : null, {
        endDate,
      })
      .andWhere(isAcc ? `isAcc='${isAcc}'` : ``)
      .leftJoin(
        (qb) =>
          qb
            .from(ResponseMember, 'ResponseMember')
            .select()
            .where(`userCode=${userCode}`),
        'L',
        'RequestInfo.requestCode = L.requestCode',
      )
      .orderBy(`RequestInfo.requestWhen`, 'DESC')
      .take(page ? 10 : null)
      .skip(page ? page - 1 : null)
      .getRawMany();

    return await Promise.all(
      requestList.map(async ({ requestCode }) => {
        return await this.getRequestByCode(requestCode, relationOptions);
      }),
    );
  }

  async getRequestListAboutRoom({
    roomCode,
    startDate,
    endDate,
    page = 0,
    relationOptions = [],
  }: {
    roomCode: number;
    startDate: Date;
    endDate: Date;
    page: number;
    relationOptions: string[];
  }) {
    let requestList = await this.createQueryBuilder()
      .select('RequestInfo.requestCode', 'requestCode')
      .where(startDate ? `requestWhen >= :startDate` : null, {
        startDate,
      })
      .andWhere(endDate ? `requestWhen < :endDate` : null, {
        endDate,
      })
      .leftJoin(
        (qb) =>
          qb
            .from(EntryAvailable, 'EntryAvailable')
            .select()
            .where(`roomCode=${roomCode}`),
        'L',
        'RequestInfo.entryAvailableCode=L.entryAvailableCode',
      )
      .orderBy(`RequestInfo.requestWhen`, 'DESC')
      .take(page ? 10 : null)
      .skip(page ? page - 1 : null)
      .getRawMany();
    return await Promise.all(
      requestList.map(async ({ requestCode }) => {
        return await this.getRequestByCode(requestCode, relationOptions);
      }),
    );
  }
}
