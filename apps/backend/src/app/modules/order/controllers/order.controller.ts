import { Controller, UseGuards, Post, Body, Get, Param, HttpException, HttpStatus } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody, ApiParam, ApiResponse } from '@nestjs/swagger';
import { ZodValidationPipe } from 'nestjs-zod';
import { z } from 'zod';

import { ObjectIdSchema } from '../../../data/common.schema';
import { OrderCreateRequestSchema, OrderResponseSchema, OrderUpdateRequestSchema } from '../order.schema';

import { OrderService } from '../order.service';
import { OrderPresenter } from '../order.presenter';
import { ZtoOAPI } from '../../../utils/open-api';

type OrderRequestDTO = z.infer<typeof OrderCreateRequestSchema>;
type OrderResponseDTO = z.infer<typeof OrderResponseSchema>;
type OrderUpdateRequestDTO = z.infer<typeof OrderUpdateRequestSchema>;

@Controller('order')
export class OrderController {

  constructor(
    private readonly orderService: OrderService
  ) { }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiBody({
    schema: ZtoOAPI('OrderRequestDTO', OrderCreateRequestSchema)
  })
  @ApiResponse({
    schema: ZtoOAPI('OrderResponseDTO', OrderResponseSchema)
  })
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
        case 'no_products':
          message = 'Order does not contain products';
          status = HttpStatus.BAD_REQUEST;
          break;

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
  @ApiBearerAuth('access-token')
  @ApiParam({
    name: 'id',
    schema: ZtoOAPI('OrderRequestDTO', ObjectIdSchema.openapi({ description: 'Order id', example: '6808c3dfaa3823a1e4ae959e' }))
  })
  @ApiResponse({
    schema: ZtoOAPI('OrderResponseDTO', OrderResponseSchema)
  })
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

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiParam({
    name: 'id',
    schema: ZtoOAPI('OrderRequestDTO', ObjectIdSchema.openapi({ description: 'Order id', example: '6808c3dfaa3823a1e4ae959e' }))
  })
  @ApiResponse({
    schema: ZtoOAPI('OrderResponseDTO', OrderResponseSchema)
  })
  @Post(':id')
  async updateOrder(
    @Param('id', new ZodValidationPipe(ObjectIdSchema)) id: string,
    @Body(new ZodValidationPipe(OrderUpdateRequestSchema)) data: OrderUpdateRequestDTO,
  ): Promise<OrderResponseDTO | HttpException> {
    try {
      return OrderPresenter(await this.orderService.update(id, data));
    } catch (error) {
      let message = error.message;
      let status = HttpStatus.INTERNAL_SERVER_ERROR;

      switch (message) {
        case 'no_products':
          message = 'Update does not contain products';
          status = HttpStatus.BAD_REQUEST;
          break;

        case 'duplicate_products':
          message = 'Update contains duplicate products';
          status = HttpStatus.BAD_REQUEST;
          break;

        case 'order_not_found':
          message = 'Order not found';
          status = HttpStatus.NOT_FOUND;
          break;

        case 'product_not_found':
          message = 'Update contains non-existing products';
          status = HttpStatus.NOT_FOUND;
          break;
      }

      throw new HttpException(message, status);
    }
  }
}
