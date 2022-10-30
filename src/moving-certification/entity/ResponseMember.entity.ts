import { TeacherInfo } from 'src/user/entity/TeacherInfo.entity';
import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ResponseType } from '../types/response.type';
import { RequestInfo } from './RequestInfo.entity';

@Entity()
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

  @ManyToOne(
    (type) => RequestInfo,
    (requestInfo) => requestInfo.responseMembers,
  )
  @JoinColumn({
    name: 'requestCode',
  })
  requestInfo: RequestInfo;
}
