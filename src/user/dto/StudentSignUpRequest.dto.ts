import { UserSignUpRequest } from './UserSignUpRequest.dto';

export interface StudentSignUpRequest extends UserSignUpRequest {
  readonly userCode: number;
  readonly enrolledAt: number;
  readonly grade: number;
  readonly classNo: number;
  readonly studentNo: number;
}
