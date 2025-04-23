import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { z } from 'zod';

import CryptoUtil from '../../utils/crypto';
import { UserService } from '../user/user.service';
import { LoginRequestSchema, RegisterRequestSchema } from '../auth/auth.schema';
import { UserDocument } from '../user/user.schema';

type UserWithToken = UserDocument & { accessToken: string };

@Injectable()
export class AuthService {

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}

  public async register(data: z.infer<typeof RegisterRequestSchema>): Promise<UserDocument> {
    const user = await this.userService.findByEmail(data.email);
    if (user) throw new Error('user_exists');

    return await this.userService.create({
      ...data,
      password: await CryptoUtil.hash(data.password)
    });
  }

  public async login(credentials: z.infer<typeof LoginRequestSchema>): Promise<UserWithToken> {
    const user: UserDocument | null =  await this.userService.findByEmail(credentials.email);
    if (!user) throw new Error('user_not_found');

    const isPasswordValid = await CryptoUtil.validate(credentials.password, user.password)
    if (!isPasswordValid) throw new Error('invalid_credentials');

    return {
      ...user.toJSON(),
      accessToken: this.jwtService.sign({ username: user.email, sub: user._id })
    } as unknown as UserWithToken;
  }
}
