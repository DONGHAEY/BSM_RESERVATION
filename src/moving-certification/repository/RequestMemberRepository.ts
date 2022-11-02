import { HttpException, HttpStatus } from '@nestjs/common';
import { CustomRepository } from 'src/custom-repository/CustomRepository.decorator';
import { TeacherInfo } from 'src/user/entity/TeacherInfo.entity';
import { Repository, MoreThan } from 'typeorm';
import { RequestMember } from '../entity/RequestMember.entity';
import { ResponseMember } from '../entity/ResponseMember.entity';
import { ResponseType } from '../types/response.type';

@CustomRepository(RequestMember)
export class RequestMemberRepository extends Repository<RequestMember> {}
