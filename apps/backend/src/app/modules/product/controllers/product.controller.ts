import { Controller, UseGuards, Post, Body, UseInterceptors, UploadedFile, Get, Param, HttpException, HttpStatus } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { ZodValidationPipe } from 'nestjs-zod';
import { z } from 'zod';
import type { Express } from 'express';
import fs from 'fs';

import { ObjectIdSchema } from '../../../data/common.schema';
import { ProductCreateRequestSchema } from '../product.schema';
import { ImageUploadPipe } from '../../../utils/image-uploads';

import { ProductService } from '../product.service';
import { ProductPresenter } from '../product.presenter';

type ProductDTO = z.infer<typeof ProductCreateRequestSchema>;

@Controller('product')
export class ProductController {

  constructor(
    private readonly productService: ProductService
  ) { }

  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('image'))
  @Post()
  async createProduct(
    @Body(new ZodValidationPipe(ProductCreateRequestSchema)) data: ProductDTO,
    @UploadedFile(ImageUploadPipe) image: Express.Multer.File
  ): Promise<ProductDTO | HttpException> {
    try {
      return ProductPresenter(await this.productService.create({
        ...data,
        imagePath: image.path
      }));
    } catch (error) {
      if (fs.existsSync(image.path)) fs.unlinkSync(image.path);
      throw new HttpException(
        error.message === 'already_exists' ? 'A product with that name already exists' : 'Could not create product',
        error.message === 'already_exists' ? HttpStatus.BAD_REQUEST : HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async getProduct(
    @Param('id', new ZodValidationPipe(ObjectIdSchema)) id: string
  ): Promise<ProductDTO | HttpException> {
    try {
      const product = await this.productService.findById(id);
      if (!product) throw new HttpException('Product not found', HttpStatus.NOT_FOUND)
      return ProductPresenter(product);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
