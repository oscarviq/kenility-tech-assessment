import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

// Modules
import { ProductModule } from '../product/product.module';
import { UserModule } from '../user/user.module';

// Schema
import { Order, OrderSchema } from './order.schema';

// Services
import { OrderService } from './order.service';

// Controllers
import { OrderController } from './controllers/order.controller';
import { OrdersController } from './controllers/orders.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema }
    ]),

    UserModule,
    ProductModule
  ],
  controllers: [
    OrderController,
    OrdersController
  ],
  providers: [
    OrderService
  ]
})
export class OrderModule {}
