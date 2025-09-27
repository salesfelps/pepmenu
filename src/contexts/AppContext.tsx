// Arquivo: AppContext.tsx
// Comentário: Este arquivo contém lógica principal/auxiliar deste módulo. Comentários curtos foram adicionados para facilitar a leitura.

import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { CartItem, Order, CustomerInfo, DeliveryInfo, PaymentInfo, Coupon } from '@/types';
import { mockOrders } from '@/data/mockData';

interface AppState {
  cart: CartItem[];
  orders: Order[];
  currentOrder?: Partial<Order>;
  customer?: CustomerInfo;
  delivery?: DeliveryInfo;
  payment?: PaymentInfo;
  appliedCoupon?: Coupon;
}

type AppAction =
  | { type: 'ADD_TO_CART'; payload: CartItem }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'UPDATE_CART_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'UPDATE_CART_ITEM'; payload: { id: string; quantity: number; observation?: string } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_CUSTOMER'; payload: CustomerInfo }
  | { type: 'SET_DELIVERY'; payload: DeliveryInfo }
  | { type: 'SET_PAYMENT'; payload: PaymentInfo }
  | { type: 'APPLY_COUPON'; payload: Coupon }
  | { type: 'REMOVE_COUPON' }
  | { type: 'ADD_ORDER'; payload: Order };

const initialState: AppState = {
  cart: [],
  orders: mockOrders,
};

const STORAGE_KEYS = {
  customer: 'pepmenu_customer',
  delivery: 'pepmenu_delivery',
} as const; 

function safeParse<T>(value: string | null): T | undefined {
  if (!value) return undefined;
  try {
    return JSON.parse(value) as T;
  } catch {
    return undefined;
  }
}

// Função/Classe: appReducer — Responsável por uma parte específica da lógica. Mantenha entradas bem definidas.
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'ADD_TO_CART':
      const existingItemIndex = state.cart.findIndex(item => 
        item.id === action.payload.id && item.observation === action.payload.observation
      );
      
      if (existingItemIndex > -1) {
        const updatedCart = [...state.cart];
        updatedCart[existingItemIndex].quantity += action.payload.quantity;
        return { ...state, cart: updatedCart };
      }
      
      return { ...state, cart: [...state.cart, action.payload] };
    
    case 'REMOVE_FROM_CART':
      return { 
        ...state, 
        cart: state.cart.filter(item => item.id !== action.payload) 
      };
    
    case 'UPDATE_CART_QUANTITY':
      return {
        ...state,
        cart: state.cart.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };

    case 'UPDATE_CART_ITEM':
      return {
        ...state,
        cart: state.cart.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity, observation: action.payload.observation }
            : item
        ),
      };
    
    case 'CLEAR_CART':
      return { ...state, cart: [] };
    
    case 'SET_CUSTOMER':
      return { ...state, customer: action.payload };
    
    case 'SET_DELIVERY':
      return { ...state, delivery: action.payload };
    
    case 'SET_PAYMENT':
      return { ...state, payment: action.payload };
    
    case 'APPLY_COUPON':
      return { ...state, appliedCoupon: action.payload };
    
    case 'REMOVE_COUPON':
      return { ...state, appliedCoupon: undefined };
    
    case 'ADD_ORDER':
      return { 
        ...state, 
        orders: [action.payload, ...state.orders],
        cart: [],
        // Mantemos customer e delivery para próximos pedidos
        payment: undefined,
        appliedCoupon: undefined
      };
    
    default:
      return state;
  }
}

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | undefined>(undefined);

// Função/Classe: AppProvider — Responsável por uma parte específica da lógica. Mantenha entradas bem definidas.
export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(
    appReducer,
    undefined as unknown as AppState,
    () => {
      const persistedCustomer = safeParse<CustomerInfo>(typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.customer) : null);
      const persistedDelivery = safeParse<DeliveryInfo>(typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.delivery) : null);
      return {
        ...initialState,
        customer: persistedCustomer || initialState.customer,
        delivery: persistedDelivery || initialState.delivery,
      } as AppState;
    }
  );

  // Persist customer when present
  useEffect(() => {
    if (state.customer) {
      try { localStorage.setItem(STORAGE_KEYS.customer, JSON.stringify(state.customer)); } catch {}
    }
  }, [state.customer]);

  // Persist delivery when present (não limpamos storage quando for undefined)
  useEffect(() => {
    if (state.delivery) {
      try { localStorage.setItem(STORAGE_KEYS.delivery, JSON.stringify(state.delivery)); } catch {}
    }
  }, [state.delivery]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

// Função/Classe: useApp — Responsável por uma parte específica da lógica. Mantenha entradas bem definidas.
export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

// Função/Classe: useCart — Responsável por uma parte específica da lógica. Mantenha entradas bem definidas.
export function useCart() {
  const { state, dispatch } = useApp();
  
// Função/Classe: addToCart — Responsável por uma parte específica da lógica. Mantenha entradas bem definidas.
  const addToCart = (item: CartItem) => {
    dispatch({ type: 'ADD_TO_CART', payload: item });
  };

// Função/Classe: updateCartItem — Atualiza quantidade e observação do item
  const updateCartItem = (id: string, quantity: number, observation?: string) => {
    dispatch({ type: 'UPDATE_CART_ITEM', payload: { id, quantity, observation } });
  };
  
// Função/Classe: removeFromCart — Responsável por uma parte específica da lógica. Mantenha entradas bem definidas.
  const removeFromCart = (id: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: id });
  };
  
// Função/Classe: updateQuantity — Responsável por uma parte específica da lógica. Mantenha entradas bem definidas.
  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
    } else {
      dispatch({ type: 'UPDATE_CART_QUANTITY', payload: { id, quantity } });
    }
  };
  
// Função/Classe: clearCart — Responsável por uma parte específica da lógica. Mantenha entradas bem definidas.
  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };
  
  const getCartTotal = () => {
    const subtotal = state.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const discount = state.appliedCoupon 
      ? state.appliedCoupon.type === 'percentage' 
        ? subtotal * (state.appliedCoupon.discount / 100)
        : state.appliedCoupon.discount
      : 0;
    return { subtotal, discount, total: subtotal - discount };
  };
  
  const getCartItemCount = () => {
    return state.cart.reduce((count, item) => count + item.quantity, 0);
  };
  
  return {
    cart: state.cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    updateCartItem,
    clearCart,
    getCartTotal,
    getCartItemCount,
  };
}