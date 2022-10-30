import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
  TableInheritance,
} from 'typeorm';
import { InCharge } from '../types/InCharge.type';
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
  @PrimaryGeneratedColumn()
  inChargeCode: number;

  @Column()
  userCode: number;

  @Column({
    type: 'enum',
    enum: InCharge,
  })
  inChargeType: InCharge;

  @ManyToOne((type) => TeacherInfo, (teacherInfo) => teacherInfo.inCharged, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'userCode',
  })
  teacher: TeacherInfo;
}
