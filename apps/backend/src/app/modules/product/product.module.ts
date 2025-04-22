import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

// Schema
import { Product, ProductSchema } from './product.schema';

// Services
import { SeederService } from '../../services/seeder.service';
import { ProductService } from './product.service';

// Controllers
import { ProductController } from './product.controller';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([{
      inject: [SeederService],
      name: Product.name,
      useFactory: async (seederService: SeederService) => {
        await seederService.seedProducts();
        return ProductSchema;
      },
    }]),
  ],
  controllers: [
    ProductController
  ],
  providers: [
    ProductService
  ]
})
export class ProductModule {}
