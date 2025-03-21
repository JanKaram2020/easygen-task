import {
  Controller,
  Post,
  Logger,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterSchema } from '@repo/api';

@Controller('user')
export class UserController {
  logger: Logger;
  constructor(private readonly userService: UserService) {
    this.logger = new Logger(UserController.name);
  }

  @Post('create')
  async create(@Body() createUserData: unknown) {
    console.log('createUserData', createUserData);
    const validatedBody = RegisterSchema.safeParse(createUserData);
    if (!validatedBody.success) {
      throw new BadRequestException(validatedBody.error.format());
    }
    try {
      return await this.userService.create(validatedBody.data);
    } catch (e) {
      this.logger.error('Something went wrong in signup:', e);
      throw e;
    }
  }
}
