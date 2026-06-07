export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image_url?: string;
  details?: Record<string, string>;
  created_at?: string;
}

export interface OrderDetails {
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  quantity: number;
  selectedSpecs?: Record<string, string>;
}
