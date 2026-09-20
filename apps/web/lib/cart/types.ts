export type CartItem = {
  variantId: string;
  productSlug: string;
  productTitle: string;
  brandName?: string | null;
  size?: string | null;
  color?: string | null;
  unitPrice: number;
  quantity: number;
};