// Arquivo: app.ts
// Comentário: Configurações da aplicação que podem ser definidas por variáveis de ambiente

import { AppConfig } from '@/types';

// Função para obter configurações da aplicação
export const getAppConfig = (): AppConfig => {
  return {
    title: import.meta.env.VITE_APP_TITLE || "PepMenu - Cardápio Online",
    restaurantName: import.meta.env.VITE_RESTAURANT_NAME || "Bella Vista Restaurante",
  };
};

export const appConfig = getAppConfig();