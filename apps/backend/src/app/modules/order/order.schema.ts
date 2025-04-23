import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';
import { z } from '../../utils/open-api';

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
  client: z.string().openapi({ description: 'Client id', example: '6808c3dfaa3823a1e4ae959e' }),
  products: z.array(z.string()).openapi({ description: 'Product ids', example: ['6808c3dfaa3823a1e4ae959e', '6808d036ed13fe968231dde9'] })
});

export const OrderUpdateRequestSchema = z.object({
  products: z.array(z.string()).openapi({ description: 'Product ids', example: ['6808c3dfaa3823a1e4ae959e', '6808d036ed13fe968231dde9'] })
});

export const OrderResponseSchema = z.object({
  id: ObjectIdSchema.openapi({ description: 'Order id', example: '6808c3dfaa3823a1e4ae959e' }),
  clientName: z.string().openapi({ description: 'Client name', example: 'John Connor' }),
  products: z.array(ProductResponseSchema).openapi({ description: 'Product ids', example: ['6808c3dfaa3823a1e4ae959e', '6808d036ed13fe968231dde9'] }),
  total: z.number().openapi({ description: 'Order total', example: 250.87 })
});

export const StatsResponseSchema = z.object({
  lastMonthTotal: z.number().openapi({ description: 'Total generated in the last 30 days', example: 5500.85 }),
  highestAmountOrder: OrderResponseSchema
});
