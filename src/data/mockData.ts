// Arquivo: mockData.ts
// Comentário: Este arquivo contém lógica principal/auxiliar deste módulo. Comentários curtos foram adicionados para facilitar a leitura.

import { Product, Category, RestaurantInfo, Order } from '@/types';
import { appConfig } from '@/config/app';
import hamburgerImg from '@/assets/hamburger.jpg';
import pizzaImg from '@/assets/pizza.jpg';
import saladImg from '@/assets/salad.jpg';
import drinkImg from '@/assets/drink.jpg';

export const restaurantInfo: RestaurantInfo = {
  name: appConfig.restaurantName,
  description: 'Sabores autênticos com ingredientes frescos e receitas tradicionais. Uma experiência gastronômica única que combina tradição e inovação.',
  isOpen: true,
  openHours: 'Qui-Dom: 18:00 às 22:00',
  address: 'R. Mal. Floriano Peixoto, 598 - Jardim Pres. Kennedy, Embu das Artes - SP, 06820-200',
  phone: '(11) 98765-4321',
  weeklySchedule: [
    { day: 'Segunda', hours: 'Fechado' },
    { day: 'Terça', hours: 'Fechado' },
    { day: 'Quarta', hours: 'Fechado' },
    { day: 'Quinta', hours: '18:00 - 22:00' },
    { day: 'Sexta', hours: '18:00 - 22:00' },
    { day: 'Sábado', hours: '18:00 - 22:00' },
    { day: 'Domingo', hours: '18:00 - 22:00' },
  ]
};

const products: Product[] = [
  {
    id: '1',
    name: 'Hambúrguer Clássico',
    description: 'Pão artesanal, hambúrguer 180g, queijo, alface, tomate e molho especial',
    price: 24.90,
    image: hamburgerImg,
    category: 'hamburguers'
  },
  {
    id: '2',
    name: 'Pizza Margherita',
    description: 'Molho de tomate, mussarela, manjericão fresco e azeite extravirgem',
    price: 32.90,
    image: pizzaImg,
    category: 'pizzas'
  },
  {
    id: '3',
    name: 'Salada Caesar',
    description: 'Alface romana, croutons, parmesão ralado e molho caesar',
    price: 18.90,
    image: saladImg,
    category: 'saladas'
  },
  {
    id: '4',
    name: 'Refrigerante 350ml',
    description: 'Coca-Cola, Guaraná ou Fanta - gelado',
    price: 5.90,
    image: drinkImg,
    category: 'bebidas'
  },
  {
    id: '5',
    name: 'Hambúrguer Bacon',
    description: 'Pão brioche, hambúrguer 200g, bacon crocante, queijo cheddar e molho barbecue',
    price: 28.90,
    image: hamburgerImg,
    category: 'hamburguers'
  },
  {
    id: '6',
    name: 'Pizza Pepperoni',
    description: 'Molho de tomate, mussarela, pepperoni e orégano',
    price: 36.90,
    image: pizzaImg,
    category: 'pizzas'
  },
  {
    id: '7',
    name: 'Salada Tropical',
    description: 'Mix de folhas, manga, abacaxi, castanhas e vinagrete de maracujá',
    price: 22.90,
    image: saladImg,
    category: 'saladas'
  },
  {
    id: '8',
    name: 'Suco Natural 400ml',
    description: 'Laranja, Acerola ou Limão - natural e sem açúcar',
    price: 8.90,
    image: drinkImg,
    category: 'bebidas'
  }
];

export const categories: Category[] = [
  {
    id: 'hamburguers',
    name: 'Hambúrguers',
    products: products.filter(p => p.category === 'hamburguers')
  },
  {
    id: 'pizzas',
    name: 'Pizzas',
    products: products.filter(p => p.category === 'pizzas')
  },
  {
    id: 'saladas',
    name: 'Saladas',
    products: products.filter(p => p.category === 'saladas')
  },
  {
    id: 'bebidas',
    name: 'Bebidas',
    products: products.filter(p => p.category === 'bebidas')
  }
];

export const mockOrders: Order[] = [
  // Exemplos para validação local — cobrindo todos os status
  {
    id: 'EMB0007',
    date: '2025-09-25T19:10:00Z',
    total: 41.70,
    status: 'pending', // Pedido recebido -> Status: Aguardando confirmação
    items: [
      { ...products[0], quantity: 1, observation: 'Sem picles' },
      { ...products[3], quantity: 2 }
    ],
    customer: { name: 'Ana Paula', phone: '(11) 91234-5678' },
    delivery: { type: 'delivery', address: 'Av. Central, 123 - Centro' },
    payment: { method: 'pix' }
  },
  {
    id: 'EMB0006',
    date: '2025-09-25T18:50:00Z',
    total: 28.90,
    status: 'confirmed', // Pedido confirmado -> Status: Em preparação
    items: [
      { ...products[4], quantity: 1 }
    ],
    customer: { name: 'Bruno Souza', phone: '(11) 92345-6789' },
    delivery: { type: 'delivery', address: 'Rua das Flores, 456 - Jardim' },
    payment: { method: 'credit' }
  },
  {
    id: 'EMB0005',
    date: '2025-09-25T18:40:00Z',
    total: 69.80,
    status: 'preparing', // Pedido confirmado -> Status: Em preparação
    items: [
      { ...products[1], quantity: 2 }
    ],
    customer: { name: 'Carlos Lima', phone: '(11) 93456-7890' },
    delivery: { type: 'delivery', address: 'Rua B, 200 - Vila Nova' },
    payment: { method: 'debit' }
  },
  {
    id: 'EMB0004',
    date: '2025-09-25T18:20:00Z',
    total: 55.80,
    status: 'on_route', // Pedido a caminho -> Status: Em rota de entrega
    items: [
      { ...products[0], quantity: 1 },
      { ...products[3], quantity: 3 }
    ],
    customer: { name: 'Daniela Rocha', phone: '(11) 94567-8901' },
    delivery: { type: 'delivery', address: 'Alameda Verde, 789 - Parque' },
    payment: { method: 'pix' }
  },
  {
    id: 'EMB0003',
    date: '2025-09-25T18:00:00Z',
    total: 32.90,
    status: 'ready', // Pedido pronto -> Status: Pronto para retirar
    items: [
      { ...products[1], quantity: 1 }
    ],
    customer: { name: 'Eduarda N.', phone: '(11) 95678-9012' },
    delivery: { type: 'pickup' },
    payment: { method: 'meal_voucher' }
  },
  {
    id: 'EMB0002',
    date: '2025-09-24T20:15:00Z',
    total: 53.80,
    status: 'delivered', // Pedido entregue -> Status: Concluído
    items: [
      { ...products[0], quantity: 2, observation: 'Sem cebola' },
      { ...products[3], quantity: 2 }
    ],
    customer: { name: 'João Silva', phone: '(11) 99999-9999' },
    delivery: { type: 'delivery', address: 'Rua A, 123 - Bairro X' },
    payment: { method: 'pix' }
  },
  {
    id: 'EMB0001',
    date: '2025-09-23T12:15:00Z',
    total: 32.90,
    status: 'canceled', // Pedido cancelado -> Status: Cancelado
    items: [
      { ...products[1], quantity: 1 }
    ],
    customer: { name: 'Maria Santos', phone: '(11) 88888-8888' },
    delivery: { type: 'pickup' },
    payment: { method: 'credit' }
  }
];

export { products };