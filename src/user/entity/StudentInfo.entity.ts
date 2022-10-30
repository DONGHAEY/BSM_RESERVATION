import { BsmOauthUserRole } from 'bsm-oauth';
import { RequestMember } from 'src/moving-certification/entity/RequestMember.entity';
// import { RequestMember } from 'src/moving-certification/entdity/RequestMember.entity';
import { Column, ChildEntity, PrimaryColumn, OneToMany } from 'typeorm';
import { User } from './User.entity';

@ChildEntity(BsmOauthUserRole.STUDENT)
export class StudentInfo extends User {
  @PrimaryColumn()
  userCode: number;

  @Column({
    nullable: false,
  })
  enrolledAt: number;

  @Column({
    nullable: false,
  })
  grade: number;

  @Column({
    nullable: false,
  })
  classNo: number;

  @Column({
    nullable: false,
  })
  studentNo: number;
}
