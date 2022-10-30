import { BsmOauthUserRole } from 'bsm-oauth';
import { Token } from 'src/auth/entity/token.entity';
import {
  BaseEntity,
  Column,
  Entity,
  PrimaryColumn,
  TableInheritance,
  OneToMany,
} from 'typeorm';
import { Level } from '../types/Level.type';

//single table pattern이라고 한다. //https://velog.io/@loakick/Nest.js-TypeORM-리팩터링-SingleTableInheritance //여기서 배웠는데 너무 좋다..
@Entity()
@TableInheritance({
  column: {
    type: 'enum',
    enum: BsmOauthUserRole,
    name: 'role',
  },
})
export class User extends BaseEntity {
  @PrimaryColumn()
  userCode: number;

  @Column({
    unique: true,
  })
  email: string;

  @Column()
  name: string;

  @Column()
  nickname: string;

  @Column({
    type: 'enum',
    enum: Level,
    default: Level.GENERAL,
  })
  level: Level;

  @Column()
  token: string;

  @Column({
    type: 'enum',
    enum: BsmOauthUserRole,
  })
  role: BsmOauthUserRole; //역할은 학생, 선생님 둘 중 하나를 가진다.

  @OneToMany((type) => Token, (token) => token.user, {
    cascade: true,
  })
  refereshTokens: [];
}
