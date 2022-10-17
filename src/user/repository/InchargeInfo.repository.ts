import { CustomRepository } from 'src/TypeormForCustomRepository/CustomRepository.decorator';
import { SelfStudyTime } from '../entity/SelfStudyTime.entity';
import { Repository } from 'typeorm';
import { InChargeInfo } from '../entity/InChargeInfo.entity';

@CustomRepository(InChargeInfo)
export class InChargeInfoRepository extends Repository<InChargeInfo> {}
