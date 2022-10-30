import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ChildEntity,
  Unique,
  Index,
} from 'typeorm';
import { InCharge } from '../types/InCharge.type';
import { InChargeInfo } from './InChargeInfo.entity';
@Entity('self_study_time')
@ChildEntity(InCharge.SELFSTUDYTIME)
@Index(['gradeNo', 'day'], { unique: true })
// @Index(['gradeNo', 'day', 'date'], {unique: true}) /// 조금 생각을 해보아야함...
export class SelfStudyTime extends InChargeInfo {
  // 자습시간 담당선생님의 정보 엔티티
  @PrimaryGeneratedColumn()
  inChargeCode: number;

  @Column()
  gradeNo: number; // 담당 학년

  @Column()
  day: number; // 담당 요일

  @Column()
  date: Date;
  // 예외 처리 - 담당요일에 등록된 선생님이 있더라도, 현재 날짜를 중점으로 오늘 담당선생님을 표시하기 위해서이다.
  // 왜냐하면 자습 날마다 담당 선생님은 한번씩 바뀔 수 있기 때문이다.
}
