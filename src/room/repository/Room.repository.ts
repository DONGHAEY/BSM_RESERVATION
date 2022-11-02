import { CustomRepository } from 'src/CustomRepository/CustomRepository.decorator';
import { Room } from '../entity/Room.entity';
import { Repository } from 'typeorm';

@CustomRepository(Room)
export class RoomRepository extends Repository<Room> {}
