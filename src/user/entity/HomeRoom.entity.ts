import {
  BaseEntity,
  Column,
  Entity,
  PrimaryColumn,
  ChildEntity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { InCharge } from '../types/InChargeType.type';
import { InChargeInfo } from './InChargeInfo.entity';

@Entity('home_room')
@ChildEntity(InCharge.HOMEROOM)
export class HomeRoom extends InChargeInfo {
  // 담임 선생님의 정보 엔티티
  @PrimaryGeneratedColumn({
    name: 'in_charge_code',
    type: 'int',
  })
  inChargeCode: number; //선생님이 학교에서 반을 관리할 때, 하나의 반만 관리하기 때문에 teacher_code에만 Primary를 주었다.

  @Column({
    name: 'grade_no',
    type: 'int',
  })
  gradeNo: number; // 담당 학년
  @Column({
    name: 'class_no',
    type: 'int',
  })
  classNo: number; //담당 반
}
