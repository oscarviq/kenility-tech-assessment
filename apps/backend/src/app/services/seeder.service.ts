import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { faker } from '@faker-js/faker';

import CryptoUtil from '../utils/crypto';

// Models
import { User, UserSchema, UserDocument } from '../modules/user/user.schema';
import { Product, ProductSchema, ProductDocument } from '../modules/product/product.schema';
import { Order, OrderSchema, OrderDocument } from '../modules/order/order.schema';

@Injectable()
export class SeederService {

  private logger = new Logger('Seed');

  private usersSeed: UserDocument[] = [];
  private productsSeed: ProductDocument[] = [];
  private ordersSeed: OrderDocument[] = [];

  constructor(
    @InjectConnection() private readonly connection: Connection
  ) {}

  public async init() {
    try {
      await this.seedUsers();
      await this.seedProducts();
      await this.seedOrders();
    } catch (error) {
      this.logger.error(error);
    }
  }

  private async seedUsers(): Promise<void> {

    const UserModel = this.connection.model(User.name, UserSchema);
    const hasData = await UserModel.findOne();

    if (!hasData) {
      this.logger.log('Seeding users');
      const defaultPassword = await CryptoUtil.hash('@Password123');

      const usersSeed = Array.from({ length: 5 }, (item, index) => ({
        email: `user-${index}@kenility.com`,
        password: defaultPassword,
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
      }));

      this.usersSeed = await UserModel.insertMany(usersSeed);
    }
  }

  private async seedProducts(): Promise<void> {

    const ProductModel = this.connection.model(Product.name, ProductSchema);
    const hasData = await ProductModel.findOne();

    if (!hasData) {
      this.logger.log('Seeding products');
      const productsSeed = Array.from({ length: 10 }, () => ({
        name: faker.commerce.productName(),
        sku: faker.commerce.isbn(),
        price: faker.commerce.price({ min: 20, max: 200 })
      }));

      this.productsSeed = await ProductModel.insertMany(productsSeed);
    }
  }

  private async seedOrders(): Promise<void> {

    const OrderModel = this.connection.model(Order.name, OrderSchema);
    const hasData = await OrderModel.findOne();

    if (!hasData) {
      this.logger.log('Seeding orders');
      const orderSeed = Array.from({ length: 20 }, () => {

        const randomClient = this.usersSeed[Math.floor(Math.random() * this.usersSeed.length)];
        const randomProducts = [...this.productsSeed].sort(() => 0.5 - Math.random()).slice(0, 3);
        const total = randomProducts.reduce((sum, product) => sum + product.price, 0);

        const to = new Date();
        const from = new Date(to.getFullYear(), to.getMonth(), 1);
        const date = faker.date.between({ to, from });

        return {
          client: randomClient._id,
          products: randomProducts.map((product) => product._id),
          total: total.toFixed(2),
          createdAt: date,
          updatedAt: date
        }
      });

      this.ordersSeed = await OrderModel.insertMany(orderSeed, { timestamps: false });
    }
  }
}
