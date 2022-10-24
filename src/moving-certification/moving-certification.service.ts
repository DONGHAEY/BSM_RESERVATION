import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RequestInfo } from './entity/RequestInfo.entity';
import { Repository } from 'typeorm';
import { RequestMember } from './entity/RequestMember.entity';

@Injectable()
export class MovingCertificationService {
  constructor(
    @InjectRepository(RequestInfo)
    private requestInfoRepository: Repository<RequestInfo>,
    @InjectRepository(RequestMember)
    private requestMemberRepository: Repository<RequestMember>,
  ) {}

  //만들어야할 메서드 정리
  // 1. 요청하기 기능
  async request() {}
  //
  // 2. 이석증 인증/거부 하기 기능
  async certificate() {}
  //
  // 3. 요청 했던 리스트 불러오기 기능
  async getRequestList() {}
  //
}
