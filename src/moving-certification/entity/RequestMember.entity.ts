import { StudentInfo } from 'src/user/entity/StudentInfo.entity';
import { User } from 'src/user/entity/User.entity';
import {
  Entity,
  BaseEntity,
  PrimaryColumn,
  OneToOne,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { RequestInfo } from './RequestInfo.entity';

@Entity('request_member')
export class RequestMember extends BaseEntity {
  @PrimaryColumn({
    name: 'request_code',
    type: 'int',
  })
  requestCode: number;

  @PrimaryColumn({
    name: 'user_code',
    type: 'int',
  })
  userCode: number;

  @ManyToOne((type) => StudentInfo, (studentInfo) => studentInfo.requestList)
  @JoinColumn({
    name: 'user_code',
  })
  studentInfo: StudentInfo;

  @ManyToOne(
    (type) => RequestInfo,
    (requestInfo) => requestInfo.requestMembers,
    {
      eager: true,
    },
  )
  @JoinColumn()
  requestInfo: RequestInfo;
}
