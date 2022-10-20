import { SetMetadata } from '@nestjs/common';
import { BsmOauthUserRole } from 'bsm-oauth';

export const Roles = (...roles: BsmOauthUserRole[]): any => {
  return SetMetadata('roles', roles);
};
