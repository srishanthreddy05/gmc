export interface Product {
  productId: string;
  name: string;
  category: string;
  mrp: number;
  price: number;
  stock: number;
  tags: string[];
  description: string;
  displayImage: string;
  album?: string[];
  enabled: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface Order {
  orderId: string;
  name: string;
  email: string;
  phone: string;
  paymentMode: string;
  status: string;
  totalAmount: number;
  cartValue: number;
  itemNames?: string[];
  items?: OrderItem[];
  createdAt: number;
  deliveryStatus?: 'delivered' | 'not-delivered';
}

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

export type ProductAvailability = 'available' | 'out-of-stock';
