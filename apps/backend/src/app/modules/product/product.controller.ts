import { Controller, Post, Body, Get, Param, HttpException, HttpStatus } from '@nestjs/common';
import { ZodValidationPipe } from 'nestjs-zod';
import { z } from 'zod';

import { ObjectIdSchema } from '../../data/common.schema';
import { ProductCreateRequestSchema } from './product.schema';

import { ProductService } from './product.service';
import { ProductPresenter } from './product.presenter';

type ProductDTO = z.infer<typeof ProductCreateRequestSchema>;

@Controller('product')
export class ProductController {

  constructor(
    private readonly productService: ProductService
  ) { }

  @Post()
  async createProduct(
    @Body(new ZodValidationPipe(ProductCreateRequestSchema)) data: ProductDTO
  ): Promise<ProductDTO | HttpException> {
    try {
      return ProductPresenter(await this.productService.create(data));
    } catch (error) {
      throw new HttpException(
        error.message === 'already_exists' ? 'A product with that name already exists' : 'Could not create product',
        error.message === 'already_exists' ? HttpStatus.BAD_REQUEST : HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get(':id')
  async getProduct(
    @Param('id', new ZodValidationPipe(ObjectIdSchema)) id: string
  ): Promise<ProductDTO | HttpException> {
    const product = await this.productService.findById(id);
    if (!product) throw new HttpException('Product not found', HttpStatus.NOT_FOUND)
    return ProductPresenter(product);
  }
}
