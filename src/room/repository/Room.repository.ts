import { Room } from '../entity/Room.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Room)
export class RoomRepository extends Repository<Room> {
  async updateRoomUsingStatus(roomCode: number, isUsing: boolean) {
    return await this.update(
      {
        roomCode,
      },
      {
        isUsing,
      },
    );
  }

  async getRoomBycode(
    roomCode: number,
    loadEntryAvailableList: boolean = false,
  ) {
    return await this.findOne({
      where: {
        roomCode,
      },
      loadEagerRelations: loadEntryAvailableList,
    });
  }
}
