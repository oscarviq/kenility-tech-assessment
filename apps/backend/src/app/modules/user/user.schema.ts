import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { z } from 'zod';

import { ObjectIdSchema } from '../../data/common.schema';

@Schema()
export class User {
  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop()
  firstName: string;

  @Prop()
  lastName: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
export type UserDocument = HydratedDocument<User>;

// Request and Responses
export const UserCreateRequestSchema = z.object({
  email: z.string(),
  password: z.string(),
  firstName: z.string(),
  lastName: z.string(),
});

export const UserResponseSchema = z.object({
  id: ObjectIdSchema,
  email: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  accessToken: z.string().optional().nullable(),
});
