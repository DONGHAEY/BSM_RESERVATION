import { Column, ChildEntity, PrimaryColumn } from 'typeorm';
import { Role } from '../types/Role.type';
import { User } from './User.entity';

@ChildEntity(Role.STUDENT)
export class StudentInfo extends User {
  @PrimaryColumn({
    name: 'code',
    type: 'int',
  })
  code: number;
  @Column({
    name: 'enrolled_at',
    type: 'int',
    nullable: false,
  })
  enrolledAt: number;

  @Column({
    name: 'grade',
    type: 'int',
    nullable: false,
  })
  grade: number;

  @Column({
    name: 'class_no',
    type: 'int',
    nullable: false,
  })
  classNo: number;

  @Column({
    name: 'student_no',
    type: 'int',
    nullable: false,
  })
  studentNo: number;
}
