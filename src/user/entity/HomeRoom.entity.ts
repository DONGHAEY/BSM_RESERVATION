import {
  BaseEntity,
  Column,
  Entity,
  PrimaryColumn,
  ChildEntity,
  PrimaryGeneratedColumn,
  Index,
} from 'typeorm';
import { InCharge } from '../types/InCharge.type';
import { InChargeInfo } from './InChargeInfo.entity';

@Entity('home_room')
@ChildEntity(InCharge.HOMEROOM)
@Index(['gradeNo', 'classNo'], { unique: true })
export class HomeRoom extends InChargeInfo {
  // 담임 선생님의 정보 엔티티
  @PrimaryGeneratedColumn({
    name: 'in_charge_code',
    type: 'int',
  })
  inChargeCode: number;

  @Column({
    name: 'user_code',
    type: 'int',
    unique: true,
  })
  userCode: number;

  @Column({
    name: 'grade_no',
    type: 'int',
  })
  gradeNo: number;

  @Column({
    name: 'class_no',
    type: 'int',
  })
  classNo: number;
}
