import { TeacherInfo } from 'src/user/entity/TeacherInfo.entity';
import { User } from 'src/user/entity/User.entity';
import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ResponseType } from '../types/response.type';
import { RequestInfo } from './RequestInfo.entity';

@Entity('ResponseMember')
export class ResponseMember {
  @PrimaryColumn()
  requestCode: number;

  @Column()
  userCode: number;

  @Column({
    type: 'enum',
    enum: ResponseType,
    default: ResponseType.NONE,
  })
  responseType: ResponseType;

  @ManyToOne((type) => User, {
    eager: true,
  })
  @JoinColumn({
    name: 'userCode',
  })
  userInfo: User;

  @ManyToOne(
    (type) => RequestInfo,
    (requestInfo) => requestInfo.responseMembers,
  )
  @JoinColumn({
    name: 'requestCode',
  })
  requestInfo: RequestInfo;
}
