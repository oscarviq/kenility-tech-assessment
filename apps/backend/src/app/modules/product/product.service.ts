import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { z } from 'zod';

import { Product, ProductCreateRequestSchema } from './product.schema';

@Injectable()
export class ProductService {

  constructor(
    @InjectModel(Product.name) private readonly model: Model<Product>,
  ) {}

  public async create(data: z.infer<typeof ProductCreateRequestSchema>): Promise<Product> {
    if (await this.findByName(data.name)) {
      throw new Error('already_exists');
    }
    return this.model.create(data);
  }

  public findByName(name: string): Promise<Product | null> {
    return this.model.findOne({ name });
  }

  public findById(_id: string): Promise<Product | null> {
    return this.model.findOne({ _id });
  }
}
