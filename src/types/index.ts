export interface Product {
  productId: string;
  name: string;
  price: number;
  stock: number;
  description: string;
  displayImage: string;
  album?: string[];
  enabled: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface Order {
  orderId: string;
  customerName: string;
  email: string;
  items: OrderItem[];
  createdAt: number;
  deliveryStatus: 'delivered' | 'not-delivered';
}

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

export type ProductAvailability = 'available' | 'out-of-stock';
