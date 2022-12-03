import {
  BaseEntity,
  Column,
  Entity,
  PrimaryColumn,
  ChildEntity,
  PrimaryGeneratedColumn,
  Index,
} from 'typeorm';
import { DirectorType } from '../types/Director.type';
import { InChargeInfo } from './InChargeInfo.entity';

@Entity('home_room')
@ChildEntity(DirectorType.HOMEROOM)
@Index(['gradeNo', 'classNo'], { unique: true })
export class HomeRoom extends InChargeInfo {
  // 담임 선생님의 정보 엔티티
  @PrimaryGeneratedColumn()
  inChargeCode: number;

  @Column()
  userCode: number;

  @Column()
  gradeNo: number;

  @Column()
  classNo: number;
}
