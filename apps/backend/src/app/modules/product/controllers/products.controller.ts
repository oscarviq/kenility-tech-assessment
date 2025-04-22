import { Controller, UseGuards, Get, HttpException, HttpStatus } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { z } from 'zod';

import { ProductCreateRequestSchema } from '../product.schema';

import { ProductService } from '../product.service';
import { ProductPresenter } from '../product.presenter';

type ProductDTO = z.infer<typeof ProductCreateRequestSchema>;

@Controller('products')
export class ProductsController {

  constructor(
    private readonly productService: ProductService
  ) { }

  @UseGuards(AuthGuard('jwt'))
  @Get('')
  async list(): Promise<ProductDTO[] | HttpException> {
    try {
      const products = await this.productService.list();
      return products.map((product) => ProductPresenter(product));
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
