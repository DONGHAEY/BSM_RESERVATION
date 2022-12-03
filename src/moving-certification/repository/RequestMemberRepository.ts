import { HttpException, HttpStatus } from '@nestjs/common';
import { TeacherInfo } from 'src/user/entity/TeacherInfo.entity';
import { Repository, MoreThan, EntityRepository } from 'typeorm';
import { RequestMember } from '../entity/RequestMember.entity';
import { ResponseMember } from '../entity/ResponseMember.entity';
import { ResponseType } from '../types/response.type';

@EntityRepository(RequestMember)
export class RequestMemberRepository extends Repository<RequestMember> {}
