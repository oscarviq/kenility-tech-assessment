import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { ZodValidationPipe } from 'nestjs-zod';
import { z } from 'zod';

import { LoginRequestSchema, RegisterRequestSchema } from './auth.schema';
import { UserResponseSchema } from '../user/user.schema';

import { AuthService } from './auth.service';
import { UserPresenter } from '../user/user.presenter';
import { ZtoOAPI } from '../../utils/open-api';

type RegistrationDTO = z.infer<typeof RegisterRequestSchema>;
type CredentialsDTO = z.infer<typeof LoginRequestSchema>;
type UserWithTokenDTO = z.infer<typeof UserResponseSchema>;

@Controller('auth')
export class AuthController {

  constructor(
    private readonly authService: AuthService
  ) {}

  @ApiBody({
    schema: ZtoOAPI('RegistrationDTO', RegisterRequestSchema)
  })
  @ApiResponse({
    schema: ZtoOAPI('UserDTO', UserResponseSchema)
  })
  @Post('register')
  async register(
    @Body(new ZodValidationPipe(RegisterRequestSchema)) data: RegistrationDTO
  ): Promise<UserWithTokenDTO | HttpException> {
    try {
      return UserPresenter(await this.authService.register(data));
    } catch (error) {
      let message = error.message;
      let status = HttpStatus.INTERNAL_SERVER_ERROR;

      switch (message) {
        case 'user_exists':
          message = 'User already has an account';
          status = HttpStatus.NOT_FOUND;
          break;
      }

      throw new HttpException(message, status);
    }
  }

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
