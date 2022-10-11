import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  PrimaryColumn,
  ManyToOne,
} from 'typeorm';
import { InCharge } from '../types/InChargeType.type';
import { TeacherInfo } from './TeacherInfo.entity';

@Entity('in_charge_info')
export class InChargeInfo extends BaseEntity {
  @PrimaryColumn({
    name: 'code',
    type: 'int',
  })
  code: number;

  @PrimaryColumn({
    name: 'in_charge_type',
    type: 'enum',
    enum: InCharge,
  })
  inChargeType: InCharge;

  @ManyToOne((type) => TeacherInfo, (teacherInfo) => teacherInfo.inCharged)
  @JoinColumn({
    name: 'code',
  })
  teacher: TeacherInfo;
}
