import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { RegisterSchemaType } from '@repo/api';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async register(userData: RegisterSchemaType) {
    return await this.userService.create(userData);
  }

  async checkIfEmailExists(email: string) {
    return await this.userService.findByEmail(email);
  }
}
