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

  @Column({
    nullable: false,
  })
  userCode: number;

  @ManyToOne((type) => User, (user) => user.refereshTokens, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'userCode',
  })
  user: User;

  @Column({ nullable: false })
  createdAt: Date;
}
