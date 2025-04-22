import { Injectable, HttpStatus } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-strategy';
import { ExtractJwt } from 'passport-jwt';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthStrategy extends PassportStrategy(Strategy, 'jwt') {

  constructor(
    private readonly jwtService: JwtService
  ) {
    super();
  }

  public validate(): void { return }

  public override async authenticate(req: Request) {
    const tokenExtractor = ExtractJwt.fromAuthHeaderAsBearerToken();
    const token = tokenExtractor(req);

    if (!token) return this.fail('UNAUTHORIZED', HttpStatus.UNAUTHORIZED);

    try {
      const user = this.jwtService.verify(token);
      this.success(user);
    } catch (error) {
      this.fail('UNAUTHORIZED', HttpStatus.BAD_REQUEST);
    }
  }
}
