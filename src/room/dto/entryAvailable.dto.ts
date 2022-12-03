import { DirectorType } from 'src/user/types/Director.type';
import { IsNotEmpty } from 'class-validator';

export class AddEntryAvailableDto {
  @IsNotEmpty()
  roomCode: number;
  @IsNotEmpty()
  day: number; //요일
  @IsNotEmpty()
  openAt: string;
  @IsNotEmpty()
  closeAt: string;
  @IsNotEmpty()
  minOcc: number;
  @IsNotEmpty()
  maxOcc: number;
  @IsNotEmpty()
  reqTo: DirectorType;
}
