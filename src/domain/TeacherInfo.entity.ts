import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { InChargeInfo } from './InChargeInfo.entity';
import { HomeRoom } from './InChargeInfo/HomeRoom.entity';
import { SelfStudyTime } from './InChargeInfo/SelfStudyTime.entity';

@Entity('Teacher_info')
export class TeacherInfo extends BaseEntity {
  @PrimaryColumn({
    name: 'user_code',
    type: 'int',
  })
  userCode: number;

  @OneToMany((type) => InChargeInfo, (inChargeInfo) => inChargeInfo.userCode)
  inCharged: InChargeInfo[]; //선생님들의 역할은 다양 할 수 있다. 담임을 하면서도 자습시간 담당이 되기도 한다.

  @OneToOne((type) => HomeRoom, (hoomRoom) => hoomRoom.teacherCode) //선생님은 하나의 담임을 할 수 있다 그래서 OneToOne을 사용.
  @JoinColumn({ name: 'user_code' })
  HomeRoomInfo: HomeRoom;

  @OneToMany(
    (type) => SelfStudyTime,
    (selfStudyTime) => selfStudyTime.teacherCode,
  )
  @JoinColumn({ name: 'user_code' })
  SelfStudyTimeInfo: SelfStudyTime[];
}
