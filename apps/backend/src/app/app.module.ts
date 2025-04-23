import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

// Utils
import DatabaseUtil from './utils/database';

// Modules
import { GlobalModule } from './global.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { ProductModule } from './modules/product/product.module';
import { OrderModule } from './modules/order/order.module';

// Services
import { SeederService } from './services/seeder.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI as string, {
      user: process.env.MONGO_USER,
      pass: process.env.MONGO_PASS,
      dbName: process.env.MONGO_DATABASE,
      onConnectionCreate: DatabaseUtil.onConnectionCreate
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),

    // Modules
    GlobalModule,
    UserModule,
    AuthModule,
    ProductModule,
    OrderModule
  ]
})
export class AppModule implements OnApplicationBootstrap {

  constructor(
    private readonly seederService: SeederService
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    await this.seederService.init();
  }
}
