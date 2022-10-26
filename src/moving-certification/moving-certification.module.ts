import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomModule } from 'src/room/room.module';
// import { RequestInfo } from './entdity/RequestInfo.entity';
// import { RequestMember } from './entdity/RequestMember.entity';
import { MovingCertificationService } from './moving-certification.service';
import { MovingCertificationController } from './moving-certification.controller';
import { UserModule } from 'src/user/user.module';
import { RequestInfo } from './enttity/RequestInfo.entity';
import { RequestMember } from './enttity/RequestMember.entity';
import { ResponseMember } from './enttity/ResponseMember.entity';
import { StudentInfo } from 'src/user/entity/StudentInfo.entity';
import { TeacherInfo } from 'src/user/entity/TeacherInfo.entity';
// import { ResponseMember } from './entdity/ResponseMember.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RequestInfo,
      RequestMember,
      ResponseMember,
      StudentInfo,
      TeacherInfo,
    ]),
    RoomModule,
    UserModule,
  ],
  providers: [MovingCertificationService],
  controllers: [MovingCertificationController],
})
export class MovingCertificationModule {}
