import { IsEmpty, IsNotEmpty, IsOptional } from 'class-validator';
import { InCharge } from '../types/InCharge.type';

export class HomeRoomDto {
  readonly incharge: InCharge = InCharge.HOMEROOM;
  @IsNotEmpty()
  grade: number;
  @IsNotEmpty()
  classNo: number;
}
