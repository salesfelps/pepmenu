// Arquivo: ProductCard.tsx
// Comentário: Este arquivo contém lógica principal/auxiliar deste módulo. Comentários curtos foram adicionados para facilitar a leitura.

import { Product } from '@/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
      <div className="aspect-square relative overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-foreground text-lg leading-tight">
            {product.name}
          </h3>
          <span className="text-primary font-bold text-lg ml-2 flex-shrink-0">
            {formatPrice(product.price)}
          </span>
        </div>
        
        <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
          {product.description}
        </p>
        
        <Button 
          className="w-full bg-gradient-primary hover:shadow-lg transition-all duration-300"
          onClick={(e) => {
            e.stopPropagation();
            onProductClick(product);
          }}
        >
          Adicionar
        </Button>
      </div>
    </Card>
  );
}