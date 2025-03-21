import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  logger: Logger;
  constructor(private jwtService: JwtService) {
    this.logger = new Logger(AuthGuard.name);
  }
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const authorization = request.headers.authorization;
    const token = authorization?.split(' ')[1];

    if (!token) {
      this.logger.error('No token found');
      throw new UnauthorizedException();
    }
    try {
      const { email, name } = await this.jwtService.verifyAsync(token);
      request.user = { email, name };
      return true;
    } catch (error) {
      this.logger.error(error);
      throw new UnauthorizedException();
    }
  }
}
