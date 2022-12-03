import { EntityRepository, Repository } from 'typeorm';
import { Token } from '../entity/token.entity';

@EntityRepository(Token)
export class tokenRepository extends Repository<Token> {}
