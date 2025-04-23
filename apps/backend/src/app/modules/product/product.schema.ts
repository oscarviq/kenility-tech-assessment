import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { z } from 'zod';

import { ObjectIdSchema } from '../../data/common.schema';

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  sku: string;

  @Prop({ required: true })
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
  price: z.preprocess((val) => Number(val), z.number())
});

export const ProductResponseSchema = z.object({
  id: ObjectIdSchema,
  name: z.string(),
  sku: z.string(),
  price: z.preprocess((val) => Number(val), z.number()),
  imagePath: z.string().nullable()
});
