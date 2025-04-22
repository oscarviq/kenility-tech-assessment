import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

// Schema
import { Product, ProductSchema } from './models/product';

// Services
import { SeederService } from '../../services/seeder.service';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        inject: [SeederService],
        name: Product.name,
        useFactory: async (seederService: SeederService) => {
          await seederService.seedProducts();
          return ProductSchema;
        },
      },
    ]),
  ]
})
export class ProductModule {}
