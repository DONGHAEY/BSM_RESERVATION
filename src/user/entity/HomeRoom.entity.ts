import {
  BaseEntity,
  Column,
  Entity,
  PrimaryColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { TeacherInfo } from './TeacherInfo.entity';

@Entity()
export class HomeRoom extends BaseEntity {
  // 담임 선생님의 정보 엔티티
  @PrimaryColumn({
    name: 'code',
    type: 'int',
  })
  code: number; //선생님이 학교에서 반을 관리할 때, 하나의 반만 관리하기 때문에 teacher_code에만 Primary를 주었다.

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

  @OneToOne((type) => TeacherInfo, (teacherInfo) => teacherInfo.code)
  @JoinColumn({
    name: 'code',
  })
  teacher: TeacherInfo;
}
