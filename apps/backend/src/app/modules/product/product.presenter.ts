import { ProductResponseSchema } from './product.schema';

export const ProductPresenter = (product: any) => {
  return ProductResponseSchema.parse({
    id: product._id.toString(),
    name: product.name,
    sku: product.sku,
    price: product.price,
    imagePath: product.imagePath
  });
};
