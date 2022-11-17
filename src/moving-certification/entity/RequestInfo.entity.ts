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

@Entity('RequestInfo')
export class RequestInfo extends BaseEntity {
  @PrimaryGeneratedColumn()
  requestCode: number;

  @Column()
  entryAvailableCode: number;

  @Column({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
  })
  requestWhen: Date; //언제 요청했는지

  @Column({
    type: 'enum',
    enum: isAccType,
    default: isAccType.WATING,
  })
  isAcc: isAccType;

  @OneToMany(
    (type) => ResponseMember,
    (responseMember) => responseMember.requestInfo,
    {
      eager: true,
      cascade: true,
    },
  )
  responseMembers: ResponseMember[]; //요청받는 선생님의 유저들 이다.

  @OneToMany(
    (type) => RequestMember,
    (requestMember) => requestMember.requestInfo,
    {
      eager: true,
      cascade: true,
    },
  )
  requestMembers: RequestMember[]; //요청하는 학생들의 유저들 이다.

  @ManyToOne(
    (type) => EntryAvailable,
    (entryAvailable) => entryAvailable.requestedList,
    {
      eager: true,
      onDelete: 'SET NULL',
    },
  )
  @JoinColumn({
    name: 'entryAvailableCode',
  })
  entryAvailableInfo: EntryAvailable;
}
