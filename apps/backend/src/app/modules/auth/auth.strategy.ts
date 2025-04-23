import { Injectable, HttpStatus } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-strategy';
import { ExtractJwt } from 'passport-jwt';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';

import { UserService } from '../user/user.service';
import { UserPresenter } from '../user/user.presenter';

@Injectable()
export class AuthStrategy extends PassportStrategy(Strategy, 'jwt') {

  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService
  ) {
    super();
  }

  public validate(): void { return }

  public override async authenticate(req: Request) {
    const tokenExtractor = ExtractJwt.fromAuthHeaderAsBearerToken();
    const token = tokenExtractor(req);

    if (!token) return this.fail('UNAUTHORIZED', HttpStatus.UNAUTHORIZED);

    try {
      const verification = this.jwtService.verify(token);
      const user = await this.userService.findByEmail(verification.username);
      if (user) this.success(verification);
      this.fail('UNAUTHORIZED', HttpStatus.BAD_REQUEST);
    } catch (error) {
      this.fail('UNAUTHORIZED', HttpStatus.BAD_REQUEST);
    }
  }
}
