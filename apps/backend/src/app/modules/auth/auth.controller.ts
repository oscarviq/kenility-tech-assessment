import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { ZodValidationPipe } from 'nestjs-zod';
import { z } from 'zod';

import { LoginRequestSchema } from './auth.schema';
import { UserResponseSchema } from '../user/user.schema';

import { AuthService } from './auth.service';
import { UserPresenter } from '../user/user.presenter';
import { ZtoOAPI } from '../../utils/open-api';

type CredentialsDTO = z.infer<typeof LoginRequestSchema>;
type UserWithTokenDTO = z.infer<typeof UserResponseSchema>;

@Controller('auth')
export class AuthController {

  constructor(
    private readonly authService: AuthService
  ) {}

  @ApiBody({
    schema: ZtoOAPI('CredentialsDTO', LoginRequestSchema)
  })
  @ApiResponse({
    schema: ZtoOAPI('UserDTO', UserResponseSchema)
  })
  @Post('login')
  async login(
    @Body(new ZodValidationPipe(LoginRequestSchema)) credentials: CredentialsDTO
  ): Promise<UserWithTokenDTO | HttpException> {
    try {
      return UserPresenter(await this.authService.login(credentials));
    } catch (error) {
      let message = error.message;
      let status = HttpStatus.INTERNAL_SERVER_ERROR;

      switch (message) {
        case 'user_not_found':
          message = 'User not found';
          status = HttpStatus.NOT_FOUND;
          break;
        case 'invalid_credentials':
          message = 'Your credentials are invalid';
          status = HttpStatus.BAD_REQUEST;
          break;
      }

      throw new HttpException(message, status);
    }
  }
}
