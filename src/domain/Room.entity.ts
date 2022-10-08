import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { EntryAvailable } from './EntryAvailable.entity';
import { RoomType } from './Room.type';

@Entity('Room')
export class Room extends BaseEntity {
  @PrimaryColumn({
    name: 'code',
    type: 'int',
  })
  code: number;

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
    (entryAvailable) => entryAvailable.roomCode,
  )
  @JoinColumn({ name: 'code' })
  entryAvailable: EntryAvailable[];
}
