import { z } from 'zod';
import { Types } from 'mongoose';

export const ObjectIdSchema = z.custom(
  (id: string) => Types.ObjectId.isValid(id),
  'Expected an ObjectId'
);
