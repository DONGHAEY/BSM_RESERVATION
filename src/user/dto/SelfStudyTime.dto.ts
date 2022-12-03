import { IsEmpty, IsNotEmpty, IsOptional } from 'class-validator';
import { DirectorType } from '../types/Director.type';

export class SelfStudyTimeDto {
  readonly incharge: DirectorType = DirectorType.SELFSTUDYTIME;
  @IsNotEmpty()
  grade: number;
  @IsNotEmpty()
  day: number;
  @IsOptional()
  date: Date;
}
