export const DEFAULT_PRODUCT_PLACEHOLDER = './placeholder-security.svg';

export function getProductMainImage(product?: { mainImage?: string; images?: string[] } | null): string {
  if (!product) return DEFAULT_PRODUCT_PLACEHOLDER;
  if (product.mainImage && product.mainImage.trim() !== '') return product.mainImage;
  if (product.images && product.images.length > 0 && product.images[0] && product.images[0].trim() !== '') {
    return product.images[0];
  }
  return DEFAULT_PRODUCT_PLACEHOLDER;
}
