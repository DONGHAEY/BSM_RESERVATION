import { CustomRepository } from 'src/TypeormForCustomRepository/CustomRepository.decorator';
import { Room } from '../entity/Room.entity';
import { Repository } from 'typeorm';
import { EntryAvailable } from '../entity/EntryAvailable.entity';
import { StudentInfo } from 'src/user/entity/StudentInfo.entity';
import { HttpException, HttpStatus } from '@nestjs/common';

@CustomRepository(EntryAvailable)
export class EntryAvailableRepository extends Repository<EntryAvailable> {
  async checkCapacity(
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

  async checkEntryTime(entryAvailable: EntryAvailable) {
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
}
