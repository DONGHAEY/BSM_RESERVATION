import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequestInfo } from './entity/RequestInfo.entity';
import { RequestMember } from './entity/RequestMember.entity';
import { MovingCertificationService } from './moving-certification.service';

@Module({
  imports: [TypeOrmModule.forFeature([RequestInfo, RequestMember])],
  providers: [MovingCertificationService],
})
export class MovingCertificationModule {}
