import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User, UserDocument } from './user.schema';

@Injectable()
export class UserService {

  constructor(
    @InjectModel(User.name) private readonly model: Model<User>
  ) {}

  public findByEmail(email: string): Promise<UserDocument | null> {
    return this.model.findOne({ email });
  }

  public findById(_id: string): Promise<UserDocument | null> {
    return this.model.findOne({ _id });
  }
}
