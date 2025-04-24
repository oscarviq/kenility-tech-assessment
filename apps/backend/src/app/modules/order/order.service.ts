import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { z } from 'zod';

import { Order, OrderCreateRequestSchema, OrderDocument, OrderUpdateRequestSchema } from './order.schema';
import { ProductDocument } from '../product/product.schema';
import { UserService } from '../user/user.service';
import { ProductService } from '../product/product.service';

@Injectable()
export class OrderService {

  constructor(
    @InjectModel(Order.name) private readonly model: Model<Order>,
    private readonly userService: UserService,
    private readonly productService: ProductService
  ) {}

  private async validateProducts(requestedProducts: string[]): Promise<ProductDocument[]> {
    const products = await this.productService.findManyById(requestedProducts);
    if (products.length !== requestedProducts.length) throw new Error('product_not_found');
    return products;
  }

  private getOrderTotal(products: ProductDocument[]) {
    const total = products.reduce((sum, product) => sum + product.price, 0);
    return total.toFixed(2);
  }

  public async create(data: z.infer<typeof OrderCreateRequestSchema>): Promise<OrderDocument> {
    if (!data.products.length) throw new Error('no_products');
    if (new Set(data.products).size !== data.products.length) throw new Error('duplicate_products');

    const user = await this.userService.findById(data.client);
    if (!user) throw new Error('client_not_found');

    const products = await this.validateProducts(data.products);

    const newOrder = await this.model.create({
      ...data,
      total: this.getOrderTotal(products)
    });

    return await this.findById(newOrder._id.toString()) as unknown as OrderDocument;
  }

  public findById(_id: string): Promise<OrderDocument | null> {
    return this.model.findOne({ _id }).populate(['client', 'products']);
  }

  public list(): Promise<OrderDocument[]> {
    return this.model.find({}).populate(['client', 'products']);
  }

  public async update(id: string, data: z.infer<typeof OrderUpdateRequestSchema>): Promise<OrderDocument> {
    if (!data.products.length) throw new Error('no_products');
    if (new Set(data.products).size !== data.products.length) throw new Error('duplicate_products');

    const order = await this.findById(id);
    if (!order) throw new Error('order_not_found');

    const products = await this.validateProducts(data.products);

    return this.model.findByIdAndUpdate(id, {
      ...data,
      total: this.getOrderTotal(products)
    }, { new: true }).populate(['client', 'products']) as unknown as OrderDocument;
  }

  public async getStats(): Promise<{
    lastMonthTotal: number,
    highestAmountOrder: OrderDocument
  }> {
    const now = new Date();
    const startOfLast30Days = new Date();
    startOfLast30Days.setDate(now.getDate() - 30);

    const result = await this.model.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfLast30Days, $lte: now }
        },
      },
      {
        $sort: { total: -1 }
      },
      {
        $group: {
          _id: null,
          accumulatedTotal: { $sum: '$total' },
          highestSellingOrder: { $first: '$$ROOT' }
        }
      }
    ]);

    return {
      lastMonthTotal: result[0].accumulatedTotal.toFixed(2),
      highestAmountOrder: await this.model.populate(result[0].highestSellingOrder, [
        { path: 'client' },
        { path: 'products' }
      ])
    }
  }
}
