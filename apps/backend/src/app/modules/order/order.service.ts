import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { z } from 'zod';

import { Order, OrderCreateRequestSchema, OrderDocument } from './order.schema';
import { UserService } from '../user/user.service';
import { ProductService } from '../product/product.service';

@Injectable()
export class OrderService {

  constructor(
    @InjectModel(Order.name) private readonly model: Model<Order>,
    private readonly userService: UserService,
    private readonly productService: ProductService
  ) {}

  public async create(data: z.infer<typeof OrderCreateRequestSchema>): Promise<OrderDocument> {
    if (new Set(data.products).size !== data.products.length) throw new Error('duplicate_products');

    const user = await this.userService.findById(data.client);
    if (!user) throw new Error('client_not_found');

    const products = await this.productService.findManyById(data.products);
    if (products.length !== data.products.length) throw new Error('product_not_found');

    const total = products.reduce((sum, product) => sum + product.price, 0);

    const newOrder = await this.model.create({
      ...data,
      total: total.toFixed(2)
    });

    return await this.findById(newOrder._id.toString()) as unknown as OrderDocument;
  }

  public findById(_id: string): Promise<OrderDocument | null> {
    return this.model.findOne({ _id }).populate(['client', 'products']);
  }

  public list(): Promise<OrderDocument[]> {
    return this.model.find({}).populate(['client', 'products']);
  }
}
