import { TeacherInfo } from 'src/user/entity/TeacherInfo.entity';
import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity()
export class ResponseMember {
  @PrimaryColumn({
    name: 'request_code',
    type: 'int',
  })
  requestCode: number;
  @Column({
    name: 'user_code',
    type: 'int',
  })
  userCode: number;
  @ManyToOne((type) => TeacherInfo, (teacherInfo) => teacherInfo.userCode, {
    eager: true,
  })
  @JoinColumn({
    name: 'user_code',
  })
  teacherInfo: TeacherInfo;
}
