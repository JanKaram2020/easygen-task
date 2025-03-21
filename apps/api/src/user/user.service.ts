import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.model';
import * as bcrypt from 'bcrypt';
import { type RegisterSchemaType } from '@repo/api';

@Injectable()
export class UserService {
  logger: Logger;
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {
    this.logger = new Logger(UserService.name);
  }

  async findOne(email: string) {
    this.logger.log('Finding user wih email ', email);
    const user = await this.userModel.findOne({ email }).select('+password');
    this.logger.log('user wih email', email, user);
    return user;
  }

  async create(user: RegisterSchemaType) {
    this.logger.log('Creating user.');
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const newUser = new this.userModel({ ...user, password: hashedPassword });
    return newUser.save();
  }
}
