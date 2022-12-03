import { BsmOauthUserRole } from 'bsm-oauth';
import { IsEmpty, IsNotEmpty, IsOptional } from 'class-validator';
import { InChargeInfo } from '../entity/InChargeInfo.entity';
import { DirectorType } from '../types/Director.type';

export class DormitoryDto {
  readonly incharge: DirectorType = DirectorType.DORMITORY;
}
