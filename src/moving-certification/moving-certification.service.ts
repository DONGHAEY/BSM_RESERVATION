import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RequestInfo } from './entity/RequestInfo.entity';
import { Repository } from 'typeorm';
import { RequestMember } from './entity/RequestMember.entity';
import { RoomService } from 'src/room/room.service';
import { RequestReservationDto } from 'src/room/dto/requestReservation.dto';

@Injectable()
export class MovingCertificationService {
  constructor(
    private roomService: RoomService,
    @InjectRepository(RequestInfo)
    private requestInfoRepository: Repository<RequestInfo>,
  ) {}

  //만들어야할 메서드 정리
  // 1. 요청하기 기능
  async requestRoom(request: RequestReservationDto) {
    // 1-1 요청하는 사항의 시간대가 사용중인지, 예약이 되어있는지 확인한다.

    const todayDate = new Date();
    const requestInfo = await this.getRequestBycodeAndDate(
      request.entryAvailableCode,
      todayDate,
    );
    if (requestInfo) {
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
    // 3. 학생이 현재 사용하고자 하는 시간대가 어떤 타입의 선생님에게 요청해야하는지 확인한다.
    // 4. 요청해야하는 선생님 타입에 따라 요청 할 특정 선생님 정보를 알아낸다. (예 : 자습담당 선생님에게 요청해야하면 오늘 자습담당 선생님에게 요청을 보낸다.)
    // 5. 선생님에게 소켓과 web push 를통해서, 알림을 보내고,
    // 6. 요청 사항 table을 DB에 저장한다.
  }
  private async getRequestBycodeAndDate(code: number, date: Date) {
    return await this.requestInfoRepository.save({
      requestCode: code,
      date,
    });
  }
}
