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

@Entity('request')
export class RequestInfo extends BaseEntity {
  @PrimaryGeneratedColumn({
    name: 'request_code',
  })
  requestCode: number;

  @Column({
    name: 'entry_available_code',
  })
  entryAvailableCode: number;

  @Column({
    name: 'request_when',
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
  })
  requestWhen: Date; //언제 요청했는지

  @Column({
    name: 'is_acc',
    type: 'enum',
    enum: isAccType,
    default: isAccType.WATING,
  })
  isAcc: isAccType;

  @OneToMany(
    (type) => ResponseMember,
    (responseMember) => responseMember.requestInfo,
  )
  responseMembers: ResponseMember[]; //요청받는 선생님의 유저들 이다.

  @OneToMany(
    (type) => RequestMember,
    (requestMember) => requestMember.requestInfo,
  )
  requestMembers: RequestMember[]; //요청하는 학생들의 유저들 이다.

  @ManyToOne((type) => EntryAvailable)
  @JoinColumn({
    name: 'entry_available_code',
  })
  entryAvailableInfo: EntryAvailable;
}
