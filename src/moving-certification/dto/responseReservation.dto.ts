import { IsNotEmpty, IsOptional } from 'class-validator';
import { ResponseType } from '../types/response.type';

export class ResponseReservationDto {
  @IsNotEmpty()
  requestCode: number;
  @IsNotEmpty()
  response: ResponseType;
  @IsOptional()
  reason: string;
}
