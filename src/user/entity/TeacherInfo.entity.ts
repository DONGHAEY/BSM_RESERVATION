import { BsmOauthUserRole } from 'bsm-oauth';
import { RequestInfo } from 'src/moving-certification/entity/RequestInfo.entity';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  ChildEntity,
} from 'typeorm';
import { HomeRoom } from './HomeRoom.entity';
import { InChargeInfo } from './InChargeInfo.entity';
import { SelfStudyTime } from './SelfStudyTime.entity';
import { User } from './User.entity';

@ChildEntity(BsmOauthUserRole.TEACHER)
export class TeacherInfo extends User {
  @PrimaryColumn({
    name: 'user_code',
    type: 'int',
  })
  userCode: number;

  @OneToMany((type) => InChargeInfo, (inChargeInfo) => inChargeInfo.teacher, {
    eager: true,
    cascade: true,
  })
  inCharged: InChargeInfo[];

  @OneToMany((type) => RequestInfo, (requestInfo) => requestInfo.teacherInfo, {
    lazy: true,
  })
  resquestList: RequestInfo[];
}
