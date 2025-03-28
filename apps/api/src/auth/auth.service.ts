import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { LoginSchemaType, RegisterSchemaType } from '@repo/api';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  logger: Logger;
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {
    this.logger = new Logger(AuthService.name);
  }

  async register(userData: RegisterSchemaType) {
    return await this.userService.create(userData);
  }

  async login(userData: LoginSchemaType) {
    const user = await this.validateUser(userData);
    this.logger.log('[login][user]', user);
    if (!user) {
      throw new UnauthorizedException();
    }
    const accessToken = await this.generateToken(user);
    return {
      ...user,
      accessToken,
    };
  }

  async generateToken(
    userData: NonNullable<Awaited<ReturnType<typeof this.validateUser>>>,
  ) {
    const { email, name } = userData;
    return await this.jwtService.signAsync({
      email,
      name,
    });
  }

  async validateUser(userData: LoginSchemaType) {
    const user = await this.checkIfEmailExists(userData.email);
    this.logger.log('[validateUser][user]', user);

    if (user) {
      const isMatch = await bcrypt.compare(userData.password, user.password);
      this.logger.log('[validateUser][user][isMatch]', isMatch);

      if (isMatch) {
        return {
          email: user.email,
          name: user.name,
        };
      }
    }
  }

  async checkIfEmailExists(email: string) {
    return await this.userService.findByEmail(email);
  }
}
