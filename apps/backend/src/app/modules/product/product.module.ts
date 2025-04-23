import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';

// Utils
import { MulterModuleOptions } from '../../utils/image-uploads';

// Schema
import { Product, ProductSchema } from './product.schema';

// Services
import { SeederService } from '../../services/seeder.service';
import { ProductService } from './product.service';

// Controllers
import { ProductController } from './controllers/product.controller';
import { ProductsController } from './controllers/products.controller';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([{
      inject: [SeederService],
      name: Product.name,
      useFactory: async (seederService: SeederService) => {
        await seederService.seedProducts();
        return ProductSchema;
      }
    }]),
    MulterModule.register(MulterModuleOptions)
  ],
  controllers: [
    ProductController,
    ProductsController
  ],
  providers: [
    ProductService
  ]
})
export class ProductModule {}
