import { StudentInfo } from 'src/user/entity/StudentInfo.entity';
import { TeacherInfo } from 'src/user/entity/TeacherInfo.entity';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { EntryAvailable } from '../../room/entity/EntryAvailable.entity';
import { isAccType } from '../types/isAcc.type';
import { RequestMember } from './RequestMember.entity';
import { ResponseMember } from './ResponseMember.entity';

@Entity('request_info')
export class RequestInfo extends BaseEntity {
  @PrimaryGeneratedColumn({
    name: 'request_code',
  })
  requestCode: number;

  @Column({
    name: 'entry_available_code',
  })
  entryAvailableCode: number;

  /*/ ********* Entry Info를 JOIN하는 부분 ********* /*/
  @ManyToOne(
    (type) => EntryAvailable,
    (entryAvailable) => entryAvailable.requestInfoList,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({
    name: 'entry_available_code',
  })
  entryAvailableInfo: EntryAvailable;
  /*/ ********* Entry Info를 JOIN하는 부분 ********* /*/

  @PrimaryColumn({
    name: 'request_at',
    type: 'datetime',
  })
  requestWhen: Date; //언제 요청했는지

  @OneToMany(
    (type) => ResponseMember,
    (responseMember) => responseMember.requestCode,
  )
  @JoinColumn({
    name: 'request_code',
  })
  teacherMembers: ResponseMember[]; //요청받는 선생님의 유저 코드이다.

  @OneToOne((type) => TeacherInfo, (teacherInfo) => teacherInfo.resquestList)
  @JoinColumn({ name: 'teacher_user_code', referencedColumnName: 'userCode' })
  teacherInfo: TeacherInfo;

  @OneToMany(
    (type) => RequestMember,
    (requestMember) => requestMember.requestCode,
    {
      eager: true,
    },
  )
  @JoinColumn({
    name: 'request_code',
  })
  requestMembers: RequestMember[];

  @Column({
    name: 'is_acc',
    enum: isAccType,
    type: 'enum',
  })
  isAcc: isAccType;
}
