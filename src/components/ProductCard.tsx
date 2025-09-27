// Arquivo: ProductCard.tsx
// Comentário: Este arquivo contém lógica principal/auxiliar deste módulo. Comentários curtos foram adicionados para facilitar a leitura.

import { Product } from '@/types';
import { Card } from '@/components/ui/card';
import { formatPrice } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  onProductClick: (product: Product) => void;
}

export default function ProductCard({ product, onProductClick }: ProductCardProps) {
  return (
    <Card 
      className="overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-product hover:-translate-y-1 border-0 shadow-card bg-card"
      onClick={() => onProductClick(product)}
    >
      <div className="flex items-center justify-between gap-4 p-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground text-base md:text-lg leading-tight break-words">
            {product.name}
          </h3>
          <p className="text-muted-foreground text-sm line-clamp-2 mt-1">
            {product.description}
          </p>
          {product.addonsOptions && product.addonsOptions.length > 0 && (
            <p className="text-xs text-muted-foreground mt-1">
              Adicionais disponíveis
            </p>
          )}
          <span className="text-primary font-bold mt-2 block">
            {formatPrice(product.price)}
          </span>
        </div>
        <div className="flex-shrink-0">
          <img 
            src={product.image} 
            alt={product.name}
            className="w-20 h-20 md:w-24 md:h-24 rounded-md object-cover"
          />
        </div>
      </div>
    </Card>
  );
}