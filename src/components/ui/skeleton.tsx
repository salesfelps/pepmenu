// Arquivo: skeleton.tsx
// Comentário: Este arquivo contém lógica principal/auxiliar deste módulo. Comentários curtos foram adicionados para facilitar a leitura.

import { cn } from "@/lib/utils";

// Função/Classe: Skeleton — Responsável por uma parte específica da lógica. Mantenha entradas bem definidas.
function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("animate-pulse rounded-md bg-muted", className)} {...props} />;
}

export { Skeleton };