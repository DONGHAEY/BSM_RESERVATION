import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomModule } from 'src/room/room.module';
import { RequestInfo } from './entity/RequestInfo.entity';
import { RequestMember } from './entity/RequestMember.entity';
import { MovingCertificationService } from './moving-certification.service';
import { MovingCertificationController } from './moving-certification.controller';
import { MovingCertificationController } from './moving-certification.controller';

@Module({
  imports: [TypeOrmModule.forFeature([RequestInfo, RequestMember]), RoomModule],
  providers: [MovingCertificationService],
  controllers: [MovingCertificationController],
})
export class MovingCertificationModule {}
