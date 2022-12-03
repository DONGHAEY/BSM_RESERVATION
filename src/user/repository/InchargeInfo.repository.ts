import { SelfStudyTime } from '../entity/SelfStudyTime.entity';
import { EntityRepository, Repository } from 'typeorm';
import { InChargeInfo } from '../entity/InChargeInfo.entity';

@EntityRepository(InChargeInfo)
export class InChargeInfoRepository extends Repository<InChargeInfo> {}
