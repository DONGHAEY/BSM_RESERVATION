import { HttpException, HttpStatus } from '@nestjs/common';
import { EntryAvailable } from 'src/room/entity/EntryAvailable.entity';
import { Repository, MoreThan, Between, EntityRepository } from 'typeorm';
import { RequestInfo } from '../entity/RequestInfo.entity';
import { RequestMember } from '../entity/RequestMember.entity';
import { ResponseMember } from '../entity/ResponseMember.entity';
import { getRequestListAboutRoomParams } from '../types/GetRequestAoutRoomParams';
import { isAccType } from '../types/isAcc.type';
import { UserRequestFindType } from '../types/UserRequestFind.type';

@EntityRepository(RequestInfo)
export class RequestInfoRepository extends Repository<RequestInfo> {
  /*/ requestCode등으로 요청정보를 불러오는 매서드이다. */
  async getRequestByCode(requestCode: number) {
    return await this.findOne({
      where: {
        requestCode,
      },
    });
  }

  /*/ 선생님이 응답이 가능한 상태인지 체크하는 매서드이다. */
  async checkCanRequest(entryAvailableCode: number): Promise<void> {
    //오늘 그 항목(그 룸의 시간)에 대해서 요청해서 "이미 승인된 항목이 있는지 확인하기 위해" 요청정보를 불러와본다.
    const isAllowedRequest = await this.getTodayRequest(
      entryAvailableCode,
      isAccType.ALLOWED,
    );
    //오늘 그 항목(그 룸의 시간)에 대해서 요청해서 "이미 예약중인 항목이 있는지 확인하기 위해" 요청정보를 불러와본다.
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

  /*/ "오늘 해당 룸과 시간"을 요청한 요청정보를 불러오는 매서드이다. */
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

  /*/ 요청이 응답이 가능한지 (이미 승인이되었거나 거부가 되었는지) 확인하는 매서드이다 */
  async checkCanResponse(requestInfo: RequestInfo) {
    // 요청이 현재 활성화 되어있는지 확인한다. ex)요청이 이미 거부 되어있거나, 승인된 경우 //
    if (requestInfo.isAcc === isAccType.DENIED || isAccType.ALLOWED) {
      throw new HttpException(
        '이미 처리된 요청입니다.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /*/ 요청에 대한 결과를 (승인됨 또는 거부됨과 같이)업데이트하는 매서드이다. */
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

  /*/ 학생들입장에서 '요청했던' "요청 리스트를 불러오는 매서드" */
  async getStudentRequestList({
    userCode,
    isAcc = null,
    page = null,
  }: UserRequestFindType) {
    let requestList = await this.createQueryBuilder()
      .select('RequestInfo.requestCode', 'requestCode')
      .where(isAcc ? `isAcc='${isAcc}'` : ``)
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
      requestList.map(async ({ requestCode }) => {
        return await this.getRequestByCode(requestCode);
      }),
    );
  }

  /*/ 선생님들의 입장에서 '받은 요청들'을 불러오는 매서드이다. */
  async getRecievedRequestList({
    userCode,
    isAcc = null,
    page = null,
  }: UserRequestFindType) {
    let requestList = await this.createQueryBuilder()
      .select('RequestInfo.requestCode', 'requestCode')
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
        return await this.getRequestByCode(requestCode);
      }),
    );
  }

  /*/ 특정 방에 대한 요청들을 불러오는 매서드이다. */
  async getRequestListAboutRoom({
    roomCode,
    startDate = null,
    endDate = null,
    page = null,
  }: getRequestListAboutRoomParams) {
    let requestList = await this.createQueryBuilder()
      .select('RequestInfo.requestCode', 'requestCode')
      .where(startDate && endDate ? `requestWhen >= :startDate` : null, {
        startDate,
      })
      .andWhere(endDate && startDate ? `requestWhen < :endDate` : null, {
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
        return await this.getRequestByCode(requestCode);
      }),
    );
  }
}
