import { Injectable } from '@nestjs/common';
import { RequestInfo } from 'src/moving-certification/entity/RequestInfo.entity';
import { RequestInfoRepository } from 'src/moving-certification/repository/RequestInfoRepository';
import { TaskService } from 'src/task/task.service';
import { AddEntryAvailableDto } from './dto/entryAvailable.dto';
import { EntryAvailable } from './entity/EntryAvailable.entity';
import { Room } from './entity/Room.entity';
import { EntryAvailableRepository } from './repository/EntryAvailable.repository';
import { RoomRepository } from './repository/Room.repository';
import { RoomType } from './type/Room.type';

@Injectable()
export class RoomService {
  constructor(
    private taskServie: TaskService,
    private roomRepository: RoomRepository,
    private entryAvailableRepository: EntryAvailableRepository,
    private requestInfoRepository: RequestInfoRepository,
  ) {}

  async registerRoom(
    roomCode: number,
    roomType: RoomType,
    roomName: string,
  ): Promise<void> {
    await this.roomRepository.save({
      roomCode,
      roomName,
      roomType,
    });
  }

  async getRoomDetail(roomCode: number) {
    const firstDate = this.getFirstOfThisWeek();
    const roomInfo = await this.roomRepository.getRoomBycode(roomCode, true);
    //moving-certification service에서 깨끗하게 해두기...
    return {
      roomInfo,
    };
  }

  async addEntryAvailableInfo(
    addEntryAvailableDto: AddEntryAvailableDto,
  ): Promise<void> {
    const room = this.roomRepository.getRoomBycode(
      addEntryAvailableDto.roomCode,
    );
    if (room) {
      await this.entryAvailableRepository.save(addEntryAvailableDto);
    }
  }

  async getRoomList(
    roomType: RoomType | null = null,
    loadEntryAvailable: boolean = false,
  ): Promise<Room[]> {
    if (roomType) {
      return await this.roomRepository.find({
        where: {
          roomType,
        },
        loadEagerRelations: loadEntryAvailable,
      });
    }
    return await this.roomRepository.find({
      loadEagerRelations: loadEntryAvailable,
    });
  }

  async getEntryAvailableInfoBycode(
    entryAvailableCode: number,
    relationOptions: string[] = [],
  ) {
    return await this.entryAvailableRepository.findOne({
      where: {
        entryAvailableCode,
      },
      relations: relationOptions,
    });
  }

  async getRoomRequestList(roomCode: number, startDate: Date, endDate: Date) {
    return await this.requestInfoRepository.getRequestListAboutRoom({
      roomCode,
      startDate,
      endDate,
    });
  }

  // 만약 현재시간이 이미 입장 가능 시간이 지났다면 바로 사용 중으로 업데이트시키고, 아니라면 입장 가능 시간에 문을 사용중으로 업데이트 시킨다.
  async startUsingRoom(
    entryAvailableInfo: EntryAvailable,
    requestInfo: RequestInfo,
  ) {
    //만약 입장 가능 시간이 지났다면
    if (
      parseInt(entryAvailableInfo.openAt) <
      parseInt(`${new Date().getHours() + new Date().getMinutes()}`)
    ) {
      //바로 사용중으로 업데이트시키고
      await this.roomRepository.updateRoomUsingStatus(
        entryAvailableInfo.roomCode,
        true,
      );
    } else {
      // 아니라면 '입장 가능 시간' 때에 문을 사용중으로 업데이트 시킨다. //
      this.taskServie.addNewSchedule(
        `${requestInfo.requestCode}-open-schedule`,
        this.getTodayTime(entryAvailableInfo.closeAt),
        async () => {
          await this.roomRepository.updateRoomUsingStatus(
            entryAvailableInfo.roomCode,
            true,
          );
        },
      );
    }
    // '닫는시간'에는 룸 사용을 미사용으로 업데이트시키는 함수를 실행한다.
    this.taskServie.addNewSchedule(
      `${requestInfo.requestCode}-close-schedule`,
      this.getTodayTime(entryAvailableInfo.closeAt),
      async () => {
        await this.roomRepository.updateRoomUsingStatus(
          entryAvailableInfo.roomCode,
          false,
        );
      },
    );
  }

  /*/ timeString은 6시 인 경우 1800으로 입력되어야한다 */
  // utill에다가 옮기기.. //
  private getTodayTime(timeString: string) {
    return new Date(
      `${new Date().toISOString().substring(0, 10)}T${[
        timeString.slice(0, 2),
        ':',
        timeString.slice(2),
      ].join('')}`,
    );
  }
  //Util에 집어넣기
  getFirstOfThisWeek(): Date {
    var currentDay = new Date();
    return new Date(
      currentDay.getFullYear(),
      currentDay.getMonth(),
      currentDay.getDate() + (1 - currentDay.getDay()),
    );
  }
}
