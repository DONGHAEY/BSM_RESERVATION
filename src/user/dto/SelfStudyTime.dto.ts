import { IsEmpty, IsNotEmpty, IsOptional } from 'class-validator';

export class SelfStudyTimeDto {
  @IsNotEmpty()
  userCode: number;
  @IsNotEmpty()
  grade: number;
  @IsNotEmpty()
  day: number;
  @IsOptional()
  date: Date;
}
