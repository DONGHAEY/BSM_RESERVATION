import { User } from 'src/user/entity/User.entity';
import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  JoinColumn,
  BaseEntity,
} from 'typeorm';
@Entity('token')
export class Token extends BaseEntity {
  @PrimaryColumn({
    length: 300,
  })
  token: string;
  @Column({
    default: true,
  })
  valid: boolean;
  @ManyToOne((type) => User, (user) => user.userCode)
  @JoinColumn({ name: 'user_code' })
  user: User;

  @Column({
    nullable: false,
    name: 'user_code',
  })
  userCode: number;

  @Column({ nullable: false })
  createdAt: Date;
}
