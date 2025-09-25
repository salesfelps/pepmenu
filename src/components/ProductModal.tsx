// Arquivo: ProductModal.tsx
// Comentário: Este arquivo contém lógica principal/auxiliar deste módulo. Comentários curtos foram adicionados para facilitar a leitura.

import { useState } from 'react';
import { ArrowLeft, Plus, Minus } from 'lucide-react';
import { Product, CartItem } from '@/types';
import { useCart } from '@/contexts/AppContext';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { formatPrice } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductModal({ product, isOpen, onClose }: ProductModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [observation, setObservation] = useState('');
  const { addToCart } = useCart();

// Função/Classe: handleAddToCart — Responsável por uma parte específica da lógica. Mantenha entradas bem definidas.
  const handleAddToCart = () => {
    if (!product) return;

    const cartItem: CartItem = {
      ...product,
      quantity,
      observation: observation.trim() || undefined,
    };

    addToCart(cartItem);
    toast({
      title: 'Produto adicionado!',
      description: `${product.name} foi adicionado ao seu carrinho.`,
    });
    
    onClose();
    setQuantity(1);
    setObservation('');
  };

// Função/Classe: updateQuantity — Responsável por uma parte específica da lógica. Mantenha entradas bem definidas.
  const updateQuantity = (newQuantity: number) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  const totalPrice = product ? product.price * quantity : 0;

  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="p-0 max-w-md mx-auto max-h-[90vh] overflow-hidden">
        <DialogHeader className="relative p-0">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 left-4 z-10 bg-white/90 hover:bg-white rounded-full shadow-md"
            onClick={onClose}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          
          <div className="aspect-square relative overflow-hidden">
            <img 
              src={product.image} 
              alt={product.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
        </DialogHeader>

        <div className="p-6 space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">{product.name}</h2>
            <p className="text-muted-foreground">{product.description}</p>
            <p className="text-2xl font-bold text-primary mt-3">{formatPrice(product.price)}</p>
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

          <div className="flex items-center justify-between">
            <Label>Quantidade</Label>
            <div className="flex items-center gap-3">
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

          <Button
            className="w-full h-12 bg-gradient-primary hover:shadow-lg transition-all duration-300 text-lg font-semibold"
            onClick={handleAddToCart}
          >
            Adicionar • {formatPrice(totalPrice)}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}