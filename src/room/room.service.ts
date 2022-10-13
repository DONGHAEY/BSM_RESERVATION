import { Injectable } from '@nestjs/common';
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
  async createRoom(
    roomCode: number,
    roomType: RoomType,
    roomName: string,
  ): Promise<Room> {
    return await this.roomRepository.save({
      roomCode,
      roomName,
      roomType,
    });
  }

  async addEntryAvailableInfo(
    roomCode: number,
    addEntryAvailableDto: AddEntryAvailableDto,
  ) {
    return await this.entryAvailableRepository.save({
      roomCode,
      ...addEntryAvailableDto,
    });
  }
}
