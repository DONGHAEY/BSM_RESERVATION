import { Module } from '@nestjs/common';
import { TaskModule } from 'src/task/task.module';
import { CustomRepositoryModule } from 'src/custom-repository/CustomRepository.module';
import { EntryAvailable } from './entity/EntryAvailable.entity';
import { EntryAvailableRepository } from './repository/EntryAvailable.repository';
import { RoomRepository } from './repository/Room.repository';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';
import { RequestInfoRepository } from 'src/moving-certification/repository/RequestInfoRepository';

@Module({
  imports: [
    CustomRepositoryModule.forCustomRepository([
      RoomRepository,
      EntryAvailableRepository,
      RequestInfoRepository,
    ]),
    TaskModule,
  ],
  controllers: [RoomController],
  providers: [RoomService],
  exports: [RoomService],
})
export class RoomModule {}
