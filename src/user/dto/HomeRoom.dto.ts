import { IsEmpty, IsNotEmpty, IsOptional } from 'class-validator';

export class HomeRoomDto {
  @IsNotEmpty()
  grade: number;
  @IsNotEmpty()
  classNo: number;
}
