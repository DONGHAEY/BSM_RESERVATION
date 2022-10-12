import { SetMetadata } from '@nestjs/common';
import { Role } from 'src/user/types/Role.type';

export const Roles = (...roles: Role[]): any => {
  return SetMetadata('roles', roles);
};
