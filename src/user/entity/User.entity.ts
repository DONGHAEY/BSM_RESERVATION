import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  TableInheritance,
} from 'typeorm';
import { Level } from '../types/Level.type';
import { Role } from '../types/Role.type';
import { StudentInfo } from './StudentInfo.entity';
import { TeacherInfo } from './TeacherInfo.entity';

//single table pattern이라고 한다. //https://velog.io/@loakick/Nest.js-TypeORM-리팩터링-SingleTableInheritance //여기서 배웠는데 너무 좋다..
@Entity({
  name: 'user',
})
@TableInheritance({
  column: {
    type: 'enum',
    enum: Role,
    name: 'role',
  },
})
export class User extends BaseEntity {
  @PrimaryColumn({
    name: 'user_code',
    type: 'int',
  })
  userCode: number;

  @Column({
    name: 'email',
    type: 'varchar',
    unique: true,
  })
  email: string;

  @Column({
    name: 'name',
    type: 'varchar',
  })
  name: string;

  @Column({
    name: 'nickname',
    type: 'varchar',
  })
  nickname: string;

  @Column({
    name: 'level',
    type: 'enum',
    enum: Level,
    default: Level.GENERAL,
  })
  level: Level;

  @Column({
    name: 'oauth_token',
    type: 'varchar',
  })
  oauthToken: string;

  @Column({
    name: 'role',
    type: 'enum',
    enum: Role,
  })
  role: Role; //역할은 학생, 선생님 둘 중 하나를 가진다.
}
