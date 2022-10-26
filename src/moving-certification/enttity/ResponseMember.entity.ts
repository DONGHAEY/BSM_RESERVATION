import { TeacherInfo } from 'src/user/entity/TeacherInfo.entity';
import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { RequestInfo } from './RequestInfo.entity';

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

  @ManyToOne(
    (type) => RequestInfo,
    (requestInfo) => requestInfo.responseMembers,
  )
  @JoinColumn({
    name: 'request_code',
  })
  requestInfo: RequestInfo;
}
