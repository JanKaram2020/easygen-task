import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginSchema, RegisterSchema } from '@repo/api';
import { AuthGuard } from './guards/auth.guard';
import { LoginUserDto, RegisterUserDto } from './auth.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  logger: Logger;
  constructor(private readonly authService: AuthService) {
    this.logger = new Logger(AuthController.name);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() loginUserData: LoginUserDto) {
    this.logger.log('loginUserData', loginUserData);
    const validatedBody = LoginSchema.safeParse(loginUserData);
    if (!validatedBody.success) {
      throw new BadRequestException(validatedBody.error.format());
    }
    try {
      return await this.authService.login(validatedBody.data);
    } catch (e) {
      this.logger.error('Something went wrong in signup:', e);
      throw e;
    }
  }

  @HttpCode(HttpStatus.OK)
  @Post('register')
  async register(@Body() createUserData: RegisterUserDto) {
    this.logger.log('createUserData', createUserData);
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

  @Get('me')
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  getUserInfo(@Request() request) {
    return request.user;
  }
}
