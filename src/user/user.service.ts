import { Inject, Injectable } from '@nestjs/common';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USER')
    private readonly userModel: typeof User,
  ) {}

  async create(data: Partial<User>): Promise<User> {
    return await this.userModel.create(data);
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userModel.findOne({ where: { email } });
  }

  async findById(id: string): Promise<User | null> {
    return await this.userModel.findByPk(id);
  }
}
