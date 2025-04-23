import { Controller, UseGuards, Get, HttpException, HttpStatus } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { z } from 'zod';

import { ProductResponseSchema } from '../product.schema';
import { ZtoOAPI } from '../../../utils/open-api';

import { ProductService } from '../product.service';
import { ProductPresenter } from '../product.presenter';

type ProductResponseDTO = z.infer<typeof ProductResponseSchema>;

@Controller('products')
export class ProductsController {

  constructor(
    private readonly productService: ProductService
  ) { }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @Get('')
  @ApiResponse({
    schema: ZtoOAPI('ProductResponseDTO', z.array(ProductResponseSchema)),
  })
  async list(): Promise<ProductResponseDTO[] | HttpException> {
    try {
      const products = await this.productService.list();
      return products.map((product) => ProductPresenter(product));
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
