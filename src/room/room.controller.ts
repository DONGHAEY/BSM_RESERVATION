import { Controller, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { levelGuard } from 'src/auth/guards/level.guard';

@Controller('room')
@UseGuards(AuthGuard, levelGuard)
export class RoomController {}
