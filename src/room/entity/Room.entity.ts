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
    (entryAvailable) => entryAvailable.room,
    {
      eager: true,
      cascade: true,
    },
  )
  entryAvailable: EntryAvailable[];
}
