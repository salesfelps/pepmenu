// Arquivo: app.ts
// Comentário: Configurações da aplicação que podem ser definidas por variáveis de ambiente

import { AppConfig } from '@/types';

// Função para obter configurações da aplicação
export const getAppConfig = (): AppConfig => {
  return {
    title: import.meta.env.VITE_APP_TITLE || "PepMenu - Cardápio Online",
    restaurantName: import.meta.env.VITE_RESTAURANT_NAME || "Emburguer Fast",
    deliveryFee: Number(import.meta.env.VITE_DELIVERY_FEE ?? 3),
    whatsappPhone: (import.meta.env.VITE_WHATSAPP_PHONE || '11971994435').replace(/\D/g, ''),
  };
};

export const appConfig = getAppConfig();