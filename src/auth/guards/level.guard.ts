import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { User } from 'src/user/entity/User.entity';
import { Level } from 'src/user/types/Level.type';

@Injectable()
export class levelGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const level: Level = this.reflector.get<number>(
      'level',
      context.getHandler(),
    );
    if (!level) {
      return true;
    }
    const request = context.switchToHttp().getRequest();

    const user = request.user as User;

    if (user.level >= level) {
      return true;
    }
  }
}
