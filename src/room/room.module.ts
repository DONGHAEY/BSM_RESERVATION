import { Module } from '@nestjs/common';
import { TaskModule } from 'src/task/task.module';
import { TypeOrmForCustomRepositoryModule } from 'src/TypeormForCustomRepository/typeormForCustomRepository.module';
import { EntryAvailableRepository } from './repository/EntryAvailable.repository';
import { RoomRepository } from './repository/Room.repository';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';

@Module({
  imports: [
    TypeOrmForCustomRepositoryModule.forCustomRepository([
      RoomRepository,
      EntryAvailableRepository,
    ]),
    TaskModule,
  ],
  controllers: [RoomController],
  providers: [RoomService],
  exports: [RoomService],
})
export class RoomModule {}
