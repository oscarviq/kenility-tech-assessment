import { Controller, UseGuards, Get, HttpException, HttpStatus } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { z } from 'zod';

import { OrderResponseSchema } from '../order.schema';

import { OrderService } from '../order.service';
import { OrderPresenter } from '../order.presenter';

type OrderResponseDTO = z.infer<typeof OrderResponseSchema>;

@Controller('orders')
export class OrdersController {

  constructor(
    private readonly orderService: OrderService
  ) { }

  @UseGuards(AuthGuard('jwt'))
  @Get('')
  async list(): Promise<OrderResponseDTO[] | HttpException> {
    try {
      const orders = await this.orderService.list();
      return orders.map((order) => OrderPresenter(order));
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
