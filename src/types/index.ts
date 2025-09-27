// Arquivo: index.ts
// Comentário: Este arquivo contém lógica principal/auxiliar deste módulo. Comentários curtos foram adicionados para facilitar a leitura.

export interface Addon {
  name: string;
  price: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  addonsOptions?: Addon[]; // configurável por produto
}

export interface CartItem extends Product {
  quantity: number;
  observation?: string;
  selectedAddons?: Addon[]; // adicionais escolhidos por item
}

export interface Category {
  id: string;
  name: string;
  products: Product[];
}

export interface Order {
  id: string;
  date: string; // data de criação do pedido
  statusUpdatedAt?: string; // horário do último status definido
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'on_route' | 'ready' | 'delivered' | 'canceled';
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

export interface WeeklyScheduleItem {
  day: string;
  hours: string; // ex: "18:00 - 22:00" ou "Fechado"
}

export interface RestaurantInfo {
  name: string;
  description: string;
  isOpen: boolean;
  openHours: string;
  address: string;
  phone: string;
  weeklySchedule?: WeeklyScheduleItem[]; // opcional para permitir fallback no front
}

export interface AppConfig {
  title: string;
  restaurantName: string;
  deliveryFee: number; // taxa de entrega (configurável futuramente via env)
  whatsappPhone: string; // número base (DDD + número). Ex.: 11971994435
}

export interface Coupon {
  code: string;
  discount: number;
  type: 'percentage' | 'fixed';
  isValid: boolean;
}