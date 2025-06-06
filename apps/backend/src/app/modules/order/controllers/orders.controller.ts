import { Controller, UseGuards, Get, HttpException, HttpStatus } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { z } from 'zod';

import { OrderResponseSchema, StatsResponseSchema } from '../order.schema';
import { ZtoOAPI } from '../../../utils/open-api';

import { OrderService } from '../order.service';
import { OrderPresenter } from '../order.presenter';

type OrderResponseDTO = z.infer<typeof OrderResponseSchema>;
type StatsResponseDTO = z.infer<typeof StatsResponseSchema>;

@Controller('orders')
export class OrdersController {

  constructor(
    private readonly orderService: OrderService
  ) { }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiResponse({
    schema: ZtoOAPI('ProductResponseDTO', z.array(OrderResponseSchema)),
  })
  @Get('')
  async list(): Promise<OrderResponseDTO[] | HttpException> {
    try {
      const orders = await this.orderService.list();
      return orders.map((order) => OrderPresenter(order));
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiResponse({
    schema: ZtoOAPI('StatsResponseDTO', z.array(StatsResponseSchema)),
  })
  @Get('stats')
  async getStats(): Promise<StatsResponseDTO | HttpException> {
    try {
      const stats = await this.orderService.getStats();
      return {
        ...stats,
        highestAmountOrder: OrderPresenter(stats.highestAmountOrder)
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
