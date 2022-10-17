import { CustomRepository } from 'src/TypeormForCustomRepository/CustomRepository.decorator';
import { SelfStudyTime } from '../entity/SelfStudyTime.entity';
import { Repository } from 'typeorm';

@CustomRepository(SelfStudyTime)
export class SelfStudyTimeRepository extends Repository<SelfStudyTime> {}
