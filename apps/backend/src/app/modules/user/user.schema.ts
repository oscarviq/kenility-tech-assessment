import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { z } from '../../utils/open-api';

import { ObjectIdSchema } from '../../data/common.schema';

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
export type UserDocument = HydratedDocument<User>;

// Request and Responses
export const UserResponseSchema = z.object({
  id: ObjectIdSchema.openapi({ description: 'User id', example: '6808c3dfaa3823a1e4ae959e' }),
  email: z.string().openapi({ description: 'Email', example: 'user-1@kenility.com' }),
  firstName: z.string().openapi({ description: 'First name', example: 'John' }),
  lastName: z.string().openapi({ description: 'Last name', example: 'Connor' }),
  accessToken: z.string().optional().nullable().openapi({ description: 'JWT', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InVzZXItMEBrZW5pbGl0eS5jb20iLCJzdWIiOiI2ODA4ZDAzNmVkMTNmZTk2ODIzMWRkZTEiLCJpYXQiOjE3NDU0MTkzasdksImV4cCI63Tc0NTUwNTczOX0.5I946qfoTUTvOBnP2_wxvPz-CPzNtbqC4FLLZGPy8yA' })
});
