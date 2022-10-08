import { BaseEntity, Column, Entity, JoinColumn, PrimaryColumn } from 'typeorm';
import { InCharge } from './InChargeType.type';

@Entity('in_charge_info')
export class InChargeInfo extends BaseEntity {
  @PrimaryColumn({
    name: 'user_code',
    type: 'int',
  })
  userCode: number;

  @PrimaryColumn({
    name: 'in_charge_type',
    type: 'enum',
    enum: InCharge,
  })
  inChargeType: InCharge;
}
