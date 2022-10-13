import { CustomRepository } from 'src/TypeormForCustomRepository/CustomRepository.decorator';
import { Room } from '../entity/Room.entity';
import { Repository } from 'typeorm';
import { EntryAvailable } from '../entity/EntryAvailable.entity';

@CustomRepository(EntryAvailable)
export class EntryAvailableRepository extends Repository<EntryAvailable> {}
