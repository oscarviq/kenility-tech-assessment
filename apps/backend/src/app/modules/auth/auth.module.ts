import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

// Modules
import { UserModule } from '../user/user.module';

// Services
import { AuthService } from './auth.service';

// Strategies
import { AuthStrategy } from './auth.strategy';

// Controllers
import { AuthController } from './auth.controller';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: process.env.JWT_EXPIRES
      }
    }),
    UserModule
  ],
  controllers: [
    AuthController
  ],
  providers: [
    AuthService,
    AuthStrategy
  ]
})
export class AuthModule {}
