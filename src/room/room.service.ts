import { HttpException, Injectable } from '@nestjs/common';
import { RequestMember } from 'src/moving-certification/entity/RequestMember.entity';
import { AddEntryAvailableDto } from './dto/entryAvailable.dto';
import { Room } from './entity/Room.entity';
import { EntryAvailableRepository } from './repository/EntryAvailable.repository';
import { RoomRepository } from './repository/Room.repository';
import { RoomType } from './type/Room.type';

@Injectable()
export class RoomService {
  constructor(
    private roomRepository: RoomRepository,
    private entryAvailableRepository: EntryAvailableRepository,
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

  async addEntryAvailableInfo(
    addEntryAvailableDto: AddEntryAvailableDto,
  ): Promise<void> {
    const room = this.getRoomBycode(addEntryAvailableDto.roomCode);
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

  async getRoomBycode(
    roomCode: number,
    loadEntryAvailableList: boolean = false,
  ) {
    return await this.roomRepository.findOne({
      where: {
        roomCode,
      },
      loadEagerRelations: loadEntryAvailableList,
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

  async setRoomUsingStatus(
    roomCode: number,
    isUsing: boolean,
    requestMembers: RequestMember[],
  ) {
    return await this.roomRepository.update(
      {
        roomCode,
      },
      {
        isUsing,
      },
    );
  }
}
