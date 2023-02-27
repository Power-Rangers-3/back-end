import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs/internal/Observable';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { ROLE_KEY } from './roles-auth.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector
    ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const requiredRole = this.reflector.getAllAndOverride<string>(
        ROLE_KEY,
        [context.getHandler(), context.getClass()],
      );
      if (!requiredRole) {
        return true;
      }
      const req = context.switchToHttp().getRequest();
      const authHeader = req.headers.authorization;
      const [ bearer, token ] = authHeader.split(' ');
      if (bearer !== 'Bearer' || !token) {
        throw new UnauthorizedException({ message: 'Unauthorized user' });
      }
      const user = this.jwtService.verify(token);
      req.user = user;

      return user.role.role === requiredRole;
    } catch (e) { 
      throw new HttpException('Not enough power, user', HttpStatus.FORBIDDEN);
    }
  }
}
