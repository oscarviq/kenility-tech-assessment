import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { faker } from '@faker-js/faker';

import CryptoUtil from '../utils/crypto';

// Models
import { User, UserSchema } from '../modules/user/user.schema';
import { Product, ProductSchema } from '../modules/product/product.schema';

@Injectable()
export class SeederService {

  constructor(
    @InjectConnection() private readonly connection: Connection
  ) {}

  public async seedUsers(): Promise<void> {
    const UserModel = this.connection.model(User.name, UserSchema);
    const hasData = await UserModel.findOne();

    if (!hasData) {
      const defaultPassword = await CryptoUtil.hash('@Password123');

      const usersSeed = Array.from({ length: 5 }, (item, index) => ({
        email: `user-${index}@kenility.com`,
        password: defaultPassword,
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
      }));

      await UserModel.insertMany(usersSeed);
    }
  }

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
