import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';

// Utils
import { MulterModuleOptions } from '../../utils/image-uploads';

// Schema
import { Product, ProductSchema } from './product.schema';

// Services
import { ProductService } from './product.service';

// Controllers
import { ProductController } from './controllers/product.controller';
import { ProductsController } from './controllers/products.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema }
    ]),
    MulterModule.register(MulterModuleOptions)
  ],
  controllers: [
    ProductController,
    ProductsController
  ],
  providers: [
    ProductService
  ],
  exports: [
    ProductService
  ]
})
export class ProductModule {}
