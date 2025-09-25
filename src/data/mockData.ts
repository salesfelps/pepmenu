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
  openHours: 'Seg-Dom: 11:00 às 23:00',
  address: 'Rua das Flores, 123 - Centro, São Paulo - SP',
  phone: '(11) 98765-4321'
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
  {
    id: 'ORD001',
    date: '2024-09-20T19:30:00Z',
    total: 53.80,
    status: 'delivered',
    items: [
      { ...products[0], quantity: 2, observation: 'Sem cebola' },
      { ...products[3], quantity: 2 }
    ],
    customer: { name: 'João Silva', phone: '(11) 99999-9999' },
    delivery: { type: 'delivery', address: 'Rua A, 123 - Bairro X' },
    payment: { method: 'pix' }
  },
  {
    id: 'ORD002',
    date: '2024-09-18T12:15:00Z',
    total: 32.90,
    status: 'delivered',
    items: [
      { ...products[1], quantity: 1 }
    ],
    customer: { name: 'Maria Santos', phone: '(11) 88888-8888' },
    delivery: { type: 'pickup' },
    payment: { method: 'credit' }
  }
];

export { products };