import { IsEmpty, IsNotEmpty } from 'class-validator';

export class SelfStudyTimeDto {
  @IsNotEmpty()
  userCode: number;
  @IsNotEmpty()
  grade: number;
  @IsNotEmpty()
  day: number;
  @IsEmpty()
  date: Date;
}
