import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { z } from 'zod';

import { ObjectIdSchema } from '../../data/common.schema';

@Schema()
export class Product {
  @Prop()
  name: string;

  @Prop()
  sku: string;

  @Prop()
  price: number;

  @Prop()
  imagePath: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
export type ProductDocument = HydratedDocument<Product>;

// Request and Responses
export const ProductCreateRequestSchema = z.object({
  name: z.string(),
  sku: z.string(),
  price: z.number()
});

export const ProductResponseSchema = z.object({
  id: ObjectIdSchema,
  name: z.string(),
  sku: z.string(),
  price: z.number(),
  imagePath: z.string().nullable().optional()
});
