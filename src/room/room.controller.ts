import { Controller, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { levelGuard } from 'src/auth/guards/level.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Controller('room')
@UseGuards(AuthGuard, levelGuard, RolesGuard)
export class RoomController {}
