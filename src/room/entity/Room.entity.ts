import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EntryAvailable } from './EntryAvailable.entity';
import { RoomType } from '../type/Room.type';

@Entity('room')
export class Room extends BaseEntity {
  @PrimaryGeneratedColumn({
    name: 'room_code',
    type: 'int',
  })
  roomCode: number; //실제 학교 DB에 있는 room 코드를 등록 해야한다..

  @Column({
    name: 'room_name',
    type: 'varchar',
  })
  roomName: string;

  @Column({
    name: 'room_type',
    type: 'enum',
    enum: RoomType,
  })
  roomType: RoomType;

  @OneToMany(
    (type) => EntryAvailable,
    (entryAvailable) => entryAvailable.room,
    {
      eager: true, // 이것은 그냥 월요일의 들어갈수 있는 정보, 화요일의 정보, 한정적이기 때문에 eager을 허용하였다.
      cascade: true,
    },
  )
  entryAvailable: EntryAvailable[];
}
