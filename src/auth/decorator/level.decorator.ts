import { SetMetadata } from '@nestjs/common';
import { Level } from 'src/user/types/Level.type';
import { Role } from 'src/user/types/Role.type';

export const Levels = (level: Level): any => {
  return SetMetadata('level', level); //bean비슷한거라네..
};
