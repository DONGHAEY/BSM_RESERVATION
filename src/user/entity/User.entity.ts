import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { Level } from '../types/Level.type';
import { Role } from '../types/Role.type';
import { StudentInfo } from './StudentInfo.entity';
import { TeacherInfo } from './TeacherInfo.entity';

@Entity('user')
export class User extends BaseEntity {
  @PrimaryColumn({
    name: 'code',
    type: 'int',
  })
  code: number;

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
  })
  level: Level;

  @Column({
    name: 'role',
    type: 'enum',
    enum: Role,
  })
  role: Role; //역할은 학생, 선생님 둘 중 하나를 가진다.

  //eager를 쓰지 않는다.
  @OneToOne((type) => StudentInfo, (studentInfo) => studentInfo.userCode)
  @JoinColumn({ name: 'code' })
  studentInfo: StudentInfo;

  @OneToOne((type) => TeacherInfo, (teacherInfo) => teacherInfo.userCode)
  @JoinColumn({ name: 'code' })
  teacherInfo: TeacherInfo;
}
