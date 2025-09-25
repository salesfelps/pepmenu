// Arquivo: ProductModal.tsx
// Comentário: Este arquivo contém lógica principal/auxiliar deste módulo. Comentários curtos foram adicionados para facilitar a leitura.

import { useEffect, useState } from 'react';
import { ArrowLeft, Plus, Minus } from 'lucide-react';
import { Product, CartItem } from '@/types';
import { useCart } from '@/contexts/AppContext';
import { Drawer, DrawerContent, DrawerFooter } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { formatPrice } from '@/lib/utils';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  initialQuantity?: number;
  initialObservation?: string;
  confirmLabel?: string;
  onConfirm?: (data: { product: Product; quantity: number; observation?: string }) => void;
}

export default function ProductModal({ product, isOpen, onClose, initialQuantity, initialObservation, confirmLabel, onConfirm }: ProductModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [observation, setObservation] = useState('');
  const { addToCart } = useCart();

// Função/Classe: handleAddToCart — Responsável por uma parte específica da lógica. Mantenha entradas bem definidas.
  const handleAddToCart = () => {
    if (!product) return;

    const obs = observation.trim() || undefined;

    if (onConfirm) {
      onConfirm({ product, quantity, observation: obs });
    } else {
      const cartItem: CartItem = {
        ...product,
        quantity,
        observation: obs,
      };
      addToCart(cartItem);
    }

    onClose();
    setQuantity(1);
    setObservation('');
  };

  // Precarrega quantidade/observação ao abrir
  // Mantém compatibilidade com uso no Menu (sem props iniciais)
  // e no Carrinho (edição)
  useEffect(() => {
    if (isOpen) {
      setQuantity(initialQuantity ?? 1);
      setObservation(initialObservation ?? '');
    }
  }, [isOpen, product, initialQuantity, initialObservation]);

// Função/Classe: updateQuantity — Responsável por uma parte específica da lógica. Mantenha entradas bem definidas.
  const updateQuantity = (newQuantity: number) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  const totalPrice = product ? product.price * quantity : 0;

  if (!product) return null;

  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent className="inset-0 top-0 bottom-0 h-dvh mt-0 rounded-none p-0 border-0 z-[60] [&>div:first-child]:hidden">
        <div className="flex h-full flex-col bg-background">
          {/* Top image occupying the upper area */}
          <div className="relative w-full h-[34vh] md:h-[40vh] overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Back button (left arrow). 'X' removed as solicitado */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-3 left-3 z-10 bg-white/90 hover:bg-white rounded-full shadow-md"
              onClick={onClose}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-1">{product.name}</h2>
              <p className="text-muted-foreground text-sm line-clamp-3">{product.description}</p>
              <p className="text-2xl font-bold text-primary mt-2">{formatPrice(product.price)}</p>
            </div>

            {/* Quantidade acima de Observações para garantir visibilidade imediata */}
            <div className="flex items-center justify-between">
              <Label className="text-sm">Quantidade</Label>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => updateQuantity(quantity - 1)}
                  disabled={quantity <= 1}
                  className="rounded-full"
                >
                  <Minus className="w-4 h-4" />
                </Button>
                
                <span className="text-xl font-semibold min-w-[2rem] text-center">
                  {quantity}
                </span>
                
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => updateQuantity(quantity + 1)}
                  className="rounded-full"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="observation">Observações</Label>
              <Textarea
                id="observation"
                placeholder="Alguma observação especial? (Ex: sem cebola, ponto da carne...)"
                value={observation}
                onChange={(e) => setObservation(e.target.value)}
                rows={3}
                className="resize-none"
              />
            </div>
          </div>

          {/* Sticky bottom action */}
          <DrawerFooter className="p-4 border-t bg-background pb-[max(1rem,env(safe-area-inset-bottom))]">
            <Button
              className="w-full h-12 bg-gradient-primary hover:shadow-lg transition-all duration-300 text-lg font-semibold"
              onClick={handleAddToCart}
            >
              {(confirmLabel ?? 'Adicionar')} {formatPrice(totalPrice)}
            </Button>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}