import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

// Utils
import DatabaseUtil from './utils/database';

// Modules
import { GlobalModule } from './global.module';
import { ProductModule } from './modules/product/product.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI!, {
      user: process.env.MONGO_USER,
      pass: process.env.MONGO_PASS,
      dbName: process.env.MONGO_DATABASE,
      onConnectionCreate: DatabaseUtil.onConnectionCreate
    }),

    // Modules
    GlobalModule,
    ProductModule
  ]
})
export class AppModule {}
