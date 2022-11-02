import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomModule } from 'src/room/room.module';
// import { RequestInfo } from './entdity/RequestInfo.entity';
// import { RequestMember } from './entdity/RequestMember.entity';
import { MovingCertificationService } from './moving-certification.service';
import { MovingCertificationController } from './moving-certification.controller';
import { UserModule } from 'src/user/user.module';
import { RequestInfo } from './entity/RequestInfo.entity';
import { RequestMember } from './entity/RequestMember.entity';
import { ResponseMember } from './entity/ResponseMember.entity';
import { StudentInfo } from 'src/user/entity/StudentInfo.entity';
import { TeacherInfo } from 'src/user/entity/TeacherInfo.entity';
import { TaskModule } from 'src/task/task.module';
import { CustomRepositoryModule } from 'src/CustomRepository/CustomRepository.module';
import { EntryAvailable } from 'src/room/entity/EntryAvailable.entity';
import { RequestInfoRepository } from './repository/RequestInfoRepository';
import { RequestMemberRepository } from './repository/RequestMemberRepository';
import { ResponseMemberRepository } from './repository/ResponseMemberRepository';
import { EntryAvailableRepository } from 'src/room/repository/EntryAvailable.repository';
// import { ResponseMember } from './entdity/ResponseMember.entity';

@Module({
  imports: [
    CustomRepositoryModule.forCustomRepository([
      RequestInfoRepository,
      RequestMemberRepository,
      ResponseMemberRepository,
      EntryAvailableRepository,
    ]),
    RoomModule,
    UserModule,
    TaskModule,
  ],
  providers: [MovingCertificationService],
  controllers: [MovingCertificationController],
})
export class MovingCertificationModule {}
