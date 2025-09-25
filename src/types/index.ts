// Arquivo: index.ts
// Comentário: Este arquivo contém lógica principal/auxiliar deste módulo. Comentários curtos foram adicionados para facilitar a leitura.

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

export interface CartItem extends Product {
  quantity: number;
  observation?: string;
}

export interface Category {
  id: string;
  name: string;
  products: Product[];
}

export interface Order {
  id: string;
  date: string;
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered';
  items: CartItem[];
  customer: CustomerInfo;
  delivery: DeliveryInfo;
  payment: PaymentInfo;
}

export interface CustomerInfo {
  name: string;
  phone: string;
}

export interface DeliveryInfo {
  type: 'delivery' | 'pickup';
  address?: string;
  cep?: string;
}

export interface PaymentInfo {
  method: 'debit' | 'credit' | 'pix' | 'meal_voucher';
}

export interface RestaurantInfo {
  name: string;
  description: string;
  isOpen: boolean;
  openHours: string;
  address: string;
  phone: string;
}

export interface Coupon {
  code: string;
  discount: number;
  type: 'percentage' | 'fixed';
  isValid: boolean;
}