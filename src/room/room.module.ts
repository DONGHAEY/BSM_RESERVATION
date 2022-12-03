import { Module } from '@nestjs/common';
import { TaskModule } from 'src/task/task.module';
import { EntryAvailable } from './entity/EntryAvailable.entity';
import { EntryAvailableRepository } from './repository/EntryAvailable.repository';
import { RoomRepository } from './repository/Room.repository';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';
import { RequestInfoRepository } from 'src/moving-certification/repository/RequestInfoRepository';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RoomRepository,
      EntryAvailableRepository,
      RequestInfoRepository,
    ]),
    TaskModule,
  ],
  controllers: [RoomController],
  providers: [RoomService],
  exports: [TypeOrmModule, RoomService],
})
export class RoomModule {}
