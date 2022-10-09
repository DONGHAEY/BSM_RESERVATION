import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';
import { InCharge } from '../user/types/InChargeType.type';

@Entity('Entry_available')
export class EntryAvailable extends BaseEntity {
  @PrimaryColumn({
    name: 'room_code',
    type: 'int',
  })
  roomCode: number;

  @PrimaryColumn({
    name: 'day',
    type: 'int',
  })
  day: number; //요일

  @PrimaryColumn({
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
}
