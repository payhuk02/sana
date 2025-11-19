export type OrderStatus = 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
  id: string;
  product_id: string;
  product_name: string;
  product_image: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface Order {
  id: string;
  order_number: string;
  user_id?: string;
  customer_email: string;
  customer_name: string;
  customer_phone: string;
  shipping_address: {
    street: string;
    city: string;
    postal_code: string;
    country: string;
  };
  payment_method: 'card' | 'bank';
  payment_status: 'pending' | 'paid' | 'failed';
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping_cost: number;
  total: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateOrderData {
  customer_email: string;
  customer_name: string;
  customer_phone: string;
  shipping_address: {
    street: string;
    city: string;
    postal_code: string;
    country: string;
  };
  payment_method: 'card' | 'bank';
  items: Array<{
    product_id: string;
    quantity: number;
    price: number;
  }>;
}

