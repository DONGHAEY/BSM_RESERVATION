import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class HomeRoom extends BaseEntity {
  // 담임 선생님의 정보 엔티티
  @PrimaryColumn({
    name: 'teacher_code',
    type: 'int',
  })
  teacherCode: number; //학교에서 반을 관리할 때, 하나의 반만 관리하기 때문에 teacher_code에만 Primary를 주었다.
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
