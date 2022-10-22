import { BsmOauthUserRole } from 'bsm-oauth';
import { RequestMember } from 'src/moving-certification/entity/RequestMember.entity';
import { Column, ChildEntity, PrimaryColumn, OneToMany } from 'typeorm';
import { User } from './User.entity';

@ChildEntity(BsmOauthUserRole.STUDENT)
export class StudentInfo extends User {
  @PrimaryColumn({
    name: 'user_code',
    type: 'int',
  })
  userCode: number;

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

  @OneToMany(
    (type) => RequestMember,
    (requestMember) => requestMember.studentInfo,
  )
  requestList: RequestMember[];
}
