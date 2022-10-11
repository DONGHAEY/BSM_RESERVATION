import {
  BaseEntity,
  Column,
  Entity,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { TeacherInfo } from './TeacherInfo.entity';

@Entity()
export class SelfStudyTime extends BaseEntity {
  // 자습시간 담당선생님의 정보 엔티티
  @PrimaryColumn({
    name: 'code',
    type: 'int',
  })
  code: number;

  @PrimaryColumn({
    name: 'grade_no',
    type: 'int',
  })
  gradeNo: number; //담당 학년 - 자습 담당선생님은 학년별로 지정된다. 1학년, 2학년 모두 자습 담당선생님이 될 수 있기 때문에 primary를 주었다.

  @PrimaryColumn({
    name: 'day',
    type: 'varchar',
  })
  day: string; // 담당 요일 - 어제 담당하셨던 자습 담당선생님이 오늘도 담당할 수 있기 때문에 primary를 주었다.

  @Column({
    name: 'date',
    type: 'date',
    nullable: true,
  })
  date: Date;
  // 예외 처리 - 담당요일에 등록된 선생님이 있더라도, 현재 날짜를 중점으로 오늘 담당선생님을 표시하기 위해서이다.
  // 왜냐하면 자습 날마다 담당 선생님은 한번씩 바뀔 수 있기 때문이다.

  @ManyToOne((type) => TeacherInfo, (teacherInfo) => teacherInfo.code)
  @JoinColumn({
    name: 'code',
  })
  teacher: TeacherInfo;
}
