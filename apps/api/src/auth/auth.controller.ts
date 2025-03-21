import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterSchema } from '@repo/api';

@Controller('auth')
export class AuthController {
  logger: Logger;
  constructor(private readonly authService: AuthService) {
    this.logger = new Logger(AuthController.name);
  }

  @HttpCode(HttpStatus.OK)
  @Post('register')
  async register(@Body() createUserData: unknown) {
    console.log('createUserData', createUserData);
    const validatedBody = RegisterSchema.safeParse(createUserData);
    if (!validatedBody.success) {
      throw new BadRequestException(validatedBody.error.format());
    }
    try {
      const userExists = await this.authService.checkIfEmailExists(
        validatedBody.data.email,
      );
      if (userExists) {
        throw new ConflictException('User Already Exist');
      }
      const savedUser = await this.authService.register(validatedBody.data);
      return {
        name: savedUser.name,
        email: savedUser.email,
      };
    } catch (e) {
      this.logger.error('Something went wrong in signup:', e);
      throw e;
    }
  }
}
