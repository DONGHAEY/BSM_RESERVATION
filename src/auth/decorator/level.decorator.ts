import { SetMetadata } from '@nestjs/common';
import { Level } from 'src/user/types/Level.type';
import { Role } from 'src/user/types/Role.type';

export const Levels = (...levels: Level[]): any => {
  return SetMetadata('levels', levels);
};
