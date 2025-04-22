import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { faker } from '@faker-js/faker';

// Models
import { Product, ProductSchema } from '../modules/product/product.schema';

@Injectable()
export class SeederService {

  constructor(
    @InjectConnection() private readonly connection: Connection
  ) {}

  public async seedProducts(): Promise<void> {
    const ProductModel = this.connection.model(Product.name, ProductSchema);
    const hasData = await ProductModel.findOne();

    if (!hasData) {
      const productsSeed = Array.from({ length: 10 }, () => ({
        name: faker.commerce.productName(),
        sku: faker.commerce.isbn(),
        price: faker.commerce.price({ min: 20, max: 200 }),
        imagePath: 'sample.png'
      }));

      await ProductModel.insertMany(productsSeed);
    }
  }
}
