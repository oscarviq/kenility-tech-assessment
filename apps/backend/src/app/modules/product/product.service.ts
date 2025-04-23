import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { z } from 'zod';
import path from 'path';

import { Product, ProductDocument, ProductCreateRequestSchema } from './product.schema';

type ProductWithImage = z.infer<typeof ProductCreateRequestSchema> & { imagePath: string };

@Injectable()
export class ProductService {

  constructor(
    @InjectModel(Product.name) private readonly model: Model<Product>
  ) {}

  public async create(data: ProductWithImage): Promise<ProductDocument> {
    if (await this.findByName(data.name)) {
      throw new Error('already_exists');
    }

    return this.model.create({
      ...data,
      imagePath: path.relative(__dirname, data.imagePath),
    });
  }

  public findByName(name: string): Promise<ProductDocument | null> {
    return this.model.findOne({ name });
  }

  public findById(_id: string): Promise<ProductDocument | null> {
    return this.model.findOne({ _id });
  }

  public list(): Promise<ProductDocument[]> {
    return this.model.find({});
  }
}
