import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('Student')
export class Student extends BaseEntity {
  @PrimaryColumn({
    name: 'code',
    type: 'int',
  })
  userCode: number;
  @Column({
    name: 'nickname',
    type: 'varchar',
  })
  nickname: string;
  @Column({
    name: 'enrolled',
    type: 'int',
  })
  enrolled: number;
  @Column({
    name: 'grade',
    type: 'int',
  })
  grade: number;
  @Column({
    name: 'classNo',
    type: 'int',
  })
  classNo: number;
  @Column({
    name: 'studentNo',
    type: 'int',
  })
  studentNo: number;
  @Column({
    name: 'name',
    type: 'varchar',
  })
  name: string;
  @Column({
    name: 'email',
    type: 'varchar',
  })
  email: string;
}
