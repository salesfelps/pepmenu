// Arquivo: utils.ts
// Comentário: Este arquivo contém lógica principal/auxiliar deste módulo. Comentários curtos foram adicionados para facilitar a leitura.

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Função/Classe: cn — Responsável por uma parte específica da lógica. Mantenha entradas bem definidas.
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Função/Classe: formatPrice — Responsável por uma parte específica da lógica. Mantenha entradas bem definidas.
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(price);
}

// Função/Classe: formatDate — Responsável por uma parte específica da lógica. Mantenha entradas bem definidas.
export function formatDate(date: string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date));
}