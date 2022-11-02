import { CustomRepository } from 'src/custom-repository/CustomRepository.decorator';
import { SelfStudyTime } from '../entity/SelfStudyTime.entity';
import { Repository } from 'typeorm';
import { InChargeInfo } from '../entity/InChargeInfo.entity';

@CustomRepository(InChargeInfo)
export class InChargeInfoRepository extends Repository<InChargeInfo> {}
