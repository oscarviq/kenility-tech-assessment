import { OrderDocument, OrderResponseSchema } from './order.schema';
import { ProductPresenter } from '../product/product.presenter';
import { ProductDocument } from '../product/product.schema';

export const OrderPresenter = (order: OrderDocument) => {
  return OrderResponseSchema.parse({
    id: order._id.toString(),
    clientName: `${ order.client.firstName } ${ order.client.lastName }`.trim(),
    products: (order.products as unknown as ProductDocument[]).map((product: ProductDocument) => ProductPresenter(product)),
    total: order.total
  });
};
