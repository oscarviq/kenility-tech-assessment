import { Controller, UseGuards, Post, Body, Get, Param, HttpException, HttpStatus } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ZodValidationPipe } from 'nestjs-zod';
import { z } from 'zod';

import { ObjectIdSchema } from '../../../data/common.schema';
import { OrderCreateRequestSchema, OrderResponseSchema } from '../order.schema';

import { OrderService } from '../order.service';
import { OrderPresenter } from '../order.presenter';

type OrderRequestDTO = z.infer<typeof OrderCreateRequestSchema>;
type OrderResponseDTO = z.infer<typeof OrderResponseSchema>;

@Controller('order')
export class OrderController {

  constructor(
    private readonly orderService: OrderService
  ) { }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async createOrder(
    @Body(new ZodValidationPipe(OrderCreateRequestSchema)) data: OrderRequestDTO,
  ): Promise<OrderResponseDTO | HttpException> {
    try {
      return OrderPresenter(await this.orderService.create(data));
    } catch (error) {
      let message = error.message;
      let status = HttpStatus.INTERNAL_SERVER_ERROR;

      switch (message) {
        case 'duplicate_products':
          message = 'Order contains duplicate products';
          status = HttpStatus.BAD_REQUEST;
          break;

        case 'client_not_found':
          message = 'Client not found';
          status = HttpStatus.NOT_FOUND;
          break;

        case 'product_not_found':
          message = 'Order contains non-existing products';
          status = HttpStatus.NOT_FOUND;
          break;
      }

      throw new HttpException(message, status);
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async getOrder(
    @Param('id', new ZodValidationPipe(ObjectIdSchema)) id: string
  ): Promise<OrderResponseDTO | HttpException> {
    try {
      const order = await this.orderService.findById(id);
      if (!order) throw new HttpException('Order not found', HttpStatus.NOT_FOUND)
      return OrderPresenter(order);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
