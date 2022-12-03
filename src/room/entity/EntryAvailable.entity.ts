import {
  BaseEntity,
  Column,
  Entity,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Room } from './Room.entity';
import { RequestInfo } from 'src/moving-certification/entity/RequestInfo.entity';
import { DirectorType } from 'src/user/types/Director.type';
// import { RequestInfo } from '../../moving-certification/entity/RequestInfo.entity';

@Entity('entry_available')
@Index(['roomCode', 'day', 'openAt'], { unique: true })
export class EntryAvailable extends BaseEntity {
  @PrimaryGeneratedColumn()
  entryAvailableCode: number;

  @Column()
  roomCode: number;

  @ManyToOne((type) => Room, (room) => room.entryAvailable, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'roomCode',
  })
  room: Room;

  @Column()
  day: number; //요일 1-월, 2-화, 3-수, 4-목, 5-금

  @Column({
    type: 'date',
    nullable: true,
  })
  date: Date | null;

  @Column({
    //0800 | 08시 00분 시작시간이 겹칠 수 없기 때문에 Primary를 주었다
    length: 4,
  })
  openAt: string;

  @Column({
    //0830 | 08시 30분
    length: 4,
  })
  closeAt: string;

  @Column()
  minOcc: number;

  @Column({
    //Maximum occupancy(최대 수용 인원)
    type: 'int',
  })
  maxOcc: number;

  @Column({
    type: 'enum',
    enum: DirectorType,
  })
  reqTo: DirectorType; //아침시간, 점심시간, 저녁자습시간, 저녁 기숙사시간에 따라, 요청 해야 하는 선생님이 달라지기 때문에 이 Column을 추가

  @OneToMany(
    (type) => RequestInfo,
    (requestInfo) => requestInfo.entryAvailableInfo,
    {
      cascade: true,
    },
  )
  requestedList: RequestInfo[];
}
