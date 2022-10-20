import { BsmOauthUserRole } from 'bsm-oauth';

export interface UserSignUpRequest {
  readonly userCode: number;
  readonly nickname: string;
  readonly name: string;
  readonly email: string;
  readonly level?: number;
}
