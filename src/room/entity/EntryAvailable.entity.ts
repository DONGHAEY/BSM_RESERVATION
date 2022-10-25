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
import { InCharge } from 'src/user/types/InCharge.type';
import { Room } from './Room.entity';
import { RequestInfo } from 'src/moving-certification/entity/RequestInfo.entity';
// import { RequestInfo } from '../../moving-certification/entity/RequestInfo.entity';

@Entity('entry_available')
@Index(['roomCode', 'day', 'openAt'], { unique: true })
export class EntryAvailable extends BaseEntity {
  @PrimaryGeneratedColumn({
    name: 'entry_available_code',
    type: 'int',
  })
  entryAvailableCode: number;

  @Column({
    name: 'room_code',
    type: 'int',
  })
  roomCode: number;

  @ManyToOne((type) => Room, (room) => room.entryAvailable, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'room_code' })
  room: Room;

  @Column({
    name: 'day',
    type: 'int',
  })
  day: number; //요일 1-월, 2-화, 3-수, 4-목, 5-금

  @Column({
    name: 'date',
    type: 'date',
    nullable: true,
  })
  date: Date | null;

  @Column({
    name: 'open_at',
    type: 'varchar', //0800 | 08시 00분 시작시간이 겹칠 수 없기 때문에 Primary를 주었다
    length: 4,
  })
  openAt: string;

  @Column({
    name: 'close_at',
    type: 'varchar', //0830 | 08시 30분
    length: 4,
  })
  closeAt: string;

  @Column({
    name: 'min_occ',
    type: 'int',
  })
  minOcc: number;

  @Column({
    name: 'max_occ', //Maximum occupancy(최대 수용 인원)
    type: 'int',
  })
  maxOcc: number;

  @Column({
    name: 'req_to',
    type: 'enum',
    enum: InCharge,
  })
  reqTo: InCharge; //아침시간, 점심시간, 저녁자습시간, 저녁 기숙사시간에 따라, 요청 해야 하는 선생님이 달라지기 때문에 이 Column을 추가

  @OneToMany(
    (type) => RequestInfo,
    (requestInfo) => requestInfo.entryAvailableInfo,
    {
      cascade: true,
      lazy: true, //요청 했던 정보들이 100개 200개가 넘어갈 수 있기 때문에 LAZY를 사용하기로 하였다.
    },
  )
  requestInfoList: RequestInfo[];
}
