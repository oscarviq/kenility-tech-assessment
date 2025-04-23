import { z } from '../../utils/open-api';

// Request and Responses
export const LoginRequestSchema = z.object({
  email: z.string().openapi({ description: 'Email', example: 'user-1@kenility.com' }),
  password: z.string().openapi({ description: 'Password', example: '@Password123' })
});

export const RegisterRequestSchema = z.object({
  email: z.string().openapi({ description: 'Email', example: 'user-1@kenility.com' }),
  password: z.string().openapi({ description: 'Password', example: '@Password123' }),
  firstName: z.string().openapi({ description: 'First name', example: 'John' }),
  lastName: z.string().openapi({ description: 'Last name', example: 'Connor' })
});
