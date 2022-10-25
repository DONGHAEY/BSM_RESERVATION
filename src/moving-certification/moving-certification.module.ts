import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomModule } from 'src/room/room.module';
import { RequestInfo } from './entity/RequestInfo.entity';
import { RequestMember } from './entity/RequestMember.entity';
import { MovingCertificationService } from './moving-certification.service';
import { MovingCertificationController } from './moving-certification.controller';
import { UserModule } from 'src/user/user.module';
import { ResponseMember } from './entity/ResponseMember.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([RequestInfo, RequestMember, ResponseMember]),
    RoomModule,
    UserModule,
  ],
  providers: [MovingCertificationService],
  controllers: [MovingCertificationController],
})
export class MovingCertificationModule {}
