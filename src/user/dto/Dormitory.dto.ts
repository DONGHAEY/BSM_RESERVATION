import { BsmOauthUserRole } from 'bsm-oauth';
import { IsEmpty, IsNotEmpty, IsOptional } from 'class-validator';
import { InChargeInfo } from '../entity/InChargeInfo.entity';
import { InCharge } from '../types/InCharge.type';

export class DormitoryDto {
  readonly incharge: InCharge = InCharge.DORMITORY;
}
