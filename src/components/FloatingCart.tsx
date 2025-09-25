// Arquivo: FloatingCart.tsx
// Comentário: Este arquivo contém lógica principal/auxiliar deste módulo. Comentários curtos foram adicionados para facilitar a leitura.

import { ShoppingBag } from 'lucide-react';
import { useCart } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

export default function FloatingCart() {
  const { cart, getCartTotal, getCartItemCount } = useCart();
  const navigate = useNavigate();
  const itemCount = getCartItemCount();
  const { total } = getCartTotal();

  if (itemCount === 0) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 animate-fade-up">
      <Button
        className="w-full h-14 bg-gradient-primary hover:shadow-floating transition-all duration-300 text-white font-medium"
        onClick={() => navigate('/cart')}
      >
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <div className="relative">
              <ShoppingBag className="w-5 h-5" />
              <div className="absolute -top-2 -right-2 bg-accent text-accent-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                {itemCount}
              </div>
            </div>
            <span>Fechar pedido</span>
          </div>
          <div className="text-right">
            <div className="text-sm opacity-90">{itemCount} {itemCount === 1 ? 'item' : 'itens'}</div>
            <div className="font-bold">{formatPrice(total)}</div>
          </div>
        </div>
      </Button>
    </div>
  );
}