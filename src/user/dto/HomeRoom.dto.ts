import { IsEmpty, IsNotEmpty, IsOptional } from 'class-validator';
import { DirectorType } from '../types/Director.type';

export class HomeRoomDto {
  readonly incharge: DirectorType = DirectorType.HOMEROOM;
  @IsNotEmpty()
  grade: number;
  @IsNotEmpty()
  classNo: number;
}
