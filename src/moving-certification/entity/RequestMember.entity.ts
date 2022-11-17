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

@Entity('RequestMember')
export class RequestMember extends BaseEntity {
  @PrimaryColumn()
  requestCode: number;

  @PrimaryColumn()
  userCode: number;

  @ManyToOne((type) => User, {
    eager: true,
  })
  @JoinColumn({
    name: 'userCode',
  })
  userInfo: User;

  @ManyToOne(
    (type) => RequestInfo,
    (requestInfo) => requestInfo.requestMembers,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({
    name: 'requestCode',
  })
  requestInfo: RequestInfo;
}
