import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { z } from '../../utils/open-api';

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
  name: z.string().openapi({ description: 'Product name', example: '6808c3dfaa3823a1e4ae959e' }),
  sku: z.string().openapi({ description: 'Product stock keeping unit', example: '978-0-09-770553-8' }),
  price: z.preprocess((val) => Number(val), z.number().positive()).openapi({ description: 'Product price', example: 29.99 }),
  image: z.object({}).optional().nullable().openapi({ description: 'Product image', example: 'File' })
});

export const ProductResponseSchema = z.object({
  id: ObjectIdSchema.openapi({ description: 'Product id', example: '6808c3dfaa3823a1e4ae959e' }),
  name: z.string().openapi({ description: 'Product name', example: '6808c3dfaa3823a1e4ae959e' }),
  sku: z.string().openapi({ description: 'Product stock keeping unit', example: '978-0-09-770553-8' }),
  price: z.preprocess((val) => Number(val), z.number()).openapi({ description: 'Product price', example: 29.99 }),
  imagePath: z.string().nullable().openapi({ description: 'Product image path', example: 'uploads/products/1745415642131-845921282-logo-small-white.png' })
});
