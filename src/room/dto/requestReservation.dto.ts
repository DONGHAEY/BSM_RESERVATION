import { IsNotEmpty } from 'class-validator';

export class RequestReservationDto {
  @IsNotEmpty()
  userCodeList: number[];
  @IsNotEmpty()
  entryAvailableCode: number;
}
