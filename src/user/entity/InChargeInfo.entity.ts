import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
  TableInheritance,
} from 'typeorm';
import { InCharge } from '../types/InChargeType.type';
import { TeacherInfo } from './TeacherInfo.entity';

@Entity('in_charge_info')
@TableInheritance({
  column: {
    type: 'enum',
    enum: InCharge,
    name: 'inChargeType',
  },
})
export class InChargeInfo extends BaseEntity {
  @PrimaryGeneratedColumn({
    name: 'in_charge_code',
    type: 'int',
  })
  inChargeCode: number;

  @Column({
    name: 'user_code',
    type: 'int',
  })
  userCode: number;

  @Column({
    name: 'in_charge_type',
    type: 'enum',
    enum: InCharge,
  })
  inChargeType: InCharge;

  @ManyToOne((type) => TeacherInfo, (teacherInfo) => teacherInfo.inCharged)
  @JoinColumn({
    name: 'user_code',
  })
  teacher: TeacherInfo;
}
