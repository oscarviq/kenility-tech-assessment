import { ProductDocument, ProductResponseSchema } from './product.schema';

export const ProductPresenter = (product: ProductDocument) => {
  return ProductResponseSchema.parse({
    id: product._id.toString(),
    name: product.name,
    sku: product.sku,
    price: product.price,
    imagePath: product.imagePath
  });
};
