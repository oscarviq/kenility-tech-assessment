import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { z } from 'zod';
import * as mongoose from 'mongoose';

import { User } from '../user/user.schema';
import { Product, ProductResponseSchema } from '../product/product.schema';
import { ObjectIdSchema } from '../../data/common.schema';

@Schema({ timestamps: true })
export class Order {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  client: User;

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }])
  products: Product;

  @Prop()
  total: number;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
export type OrderDocument = HydratedDocument<Order>;

// Request and Responses
export const OrderCreateRequestSchema = z.object({
  client: z.string(),
  products: z.array(z.string())
});

export const OrderUpdateRequestSchema = z.object({
  products: z.array(z.string())
});

export const OrderResponseSchema = z.object({
  id: ObjectIdSchema,
  clientName: z.string(),
  products: z.array(ProductResponseSchema),
  total: z.number()
});
