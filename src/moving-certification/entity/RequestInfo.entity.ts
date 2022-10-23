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

@Entity('request_info')
export class RequestInfo extends BaseEntity {
  @PrimaryGeneratedColumn({
    name: 'request_code',
  })
  requestCode: number;

  /*/ ********* Entry Available Entity의 Primary Keys ********* /*/
  @Column({
    name: 'room_code',
    type: 'int',
  })
  roomCode: number;

  @Column({
    //요일
    name: 'day',
    type: 'int',
  })
  day: number;

  @Column({
    name: 'open_at',
    type: 'varchar',
    length: 4,
  })
  openAt: string;

  /*/ ********* Entry Available Entity의 Primary Keys ********* /*/

  /*/ ********* Entry Info를 JOIN하는 부분 ********* /*/
  @ManyToOne(
    (type) => EntryAvailable,
    (entryAvailable) => entryAvailable.requestInfoList,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn([
    { name: 'room_code', referencedColumnName: 'roomCode' },
    { name: 'day', referencedColumnName: 'day' },
    { name: 'open_at', referencedColumnName: 'openAt' },
  ])
  entryAvailableInfo: EntryAvailable;
  /*/ ********* Entry Info를 JOIN하는 부분 ********* /*/

  @PrimaryColumn({
    name: 'request_at',
    type: 'datetime',
  })
  requestWhen: Date; //언제 요청했는지

  @Column({
    name: 'teacher_user_code',
    type: 'int',
  })
  teacherUserCode: number; //요청받는 선생님의 유저 코드이다.

  @OneToOne((type) => TeacherInfo, (teacherInfo) => teacherInfo.resquestList)
  @JoinColumn({ name: 'teacher_user_code', referencedColumnName: 'userCode' })
  teacherInfo: TeacherInfo;

  @OneToMany(
    (type) => RequestMember,
    (requestMember) => requestMember.requestInfo,
    {
      eager: true,
    },
  )
  requestMembers: RequestMember[];

  @Column({
    name: 'is_acc',
    enum: isAccType,
    type: 'enum',
  })
  isAcc: isAccType;
}
