import { z } from 'zod';

// Request and Responses
export const LoginRequestSchema = z.object({
  email: z.string(),
  password: z.string()
});
