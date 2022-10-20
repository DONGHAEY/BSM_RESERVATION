import { IsEmpty, IsNotEmpty, IsOptional } from 'class-validator';
import { InCharge } from '../types/InCharge.type';

export class SelfStudyTimeDto {
  readonly incharge: InCharge = InCharge.SELFSTUDYTIME;
  @IsNotEmpty()
  grade: number;
  @IsNotEmpty()
  day: number;
  @IsOptional()
  date: Date;
}
