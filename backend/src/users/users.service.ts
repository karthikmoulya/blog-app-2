import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findOneByEmail(email: string): Promise<User | undefined> {
    const user = await this.userModel.findOne({ email }).exec();
    return user ? user : undefined;
  }

  async create(userData: Partial<User>): Promise<User> {
    const createdUser = this.userModel.create(userData);
    return createdUser;
  }

  async findOneById(id: string): Promise<User | undefined> {
    const user = await this.userModel.findById(id).exec();
    return user ? user : undefined;
  }

  async updatePassword(
    id: string,
    password: string,
  ): Promise<User | undefined> {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, { password }, { new: true })
      .exec();
    return updatedUser ? updatedUser : undefined;
  }
}
