// Arquivo: Cart.tsx
// Comentário: Este arquivo contém lógica principal/auxiliar deste módulo. Comentários curtos foram adicionados para facilitar a leitura.

import { useEffect, useState } from 'react';
import { ArrowLeft, Tag, Plus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart, useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { formatPrice } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import ProductModal from '@/components/ProductModal';

export default function Cart() {
  const navigate = useNavigate();
  const { cart, updateQuantity, updateCartItem, removeFromCart, getCartTotal, clearCart } = useCart();
  const { state, dispatch } = useApp();
  const [couponCode, setCouponCode] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  // Foco no topo ao entrar na tela
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Estado para edição de item via Drawer
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const { subtotal, discount, total } = getCartTotal();

  const hasDeliveryInfo = Boolean(state.customer && state.delivery && state.delivery.type);

// Função/Classe: handleApplyCoupon — Responsável por uma parte específica da lógica. Mantenha entradas bem definidas.
  const handleApplyCoupon = async () => {
    setIsApplyingCoupon(true);
    
    // Simulate coupon validation
    setTimeout(() => {
      const code = couponCode.trim().toLowerCase();

      // Mock de cupons disponíveis (dev)
      const coupons: Record<string, { discount: number; type: 'percentage' | 'fixed'; description: string }> = {
        pep10: { discount: 10, type: 'percentage', description: '10% de desconto' },
        pep5: { discount: 5, type: 'fixed', description: 'R$ 5,00 de desconto' },
        desconto10: { discount: 10, type: 'percentage', description: '10% de desconto' },
      };

      const found = coupons[code];

      if (found) {
        dispatch({ 
          type: 'APPLY_COUPON', 
          payload: { 
            code: code.toUpperCase(), 
            discount: found.discount, 
            type: found.type, 
            isValid: true 
          } 
        });
        toast({
          title: 'Cupom aplicado!',
          description: `${found.description} aplicado ao seu pedido.`,
        });
      } else {
        toast({
          title: 'Cupom inválido',
          description: 'Verifique o código e tente novamente.',
          variant: 'destructive',
        });
      }
      setIsApplyingCoupon(false);
      setCouponCode('');
    }, 800);
  };

// Função/Classe: handleRemoveCoupon — Responsável por uma parte específica da lógica. Mantenha entradas bem definidas.
  const handleRemoveCoupon = () => {
    dispatch({ type: 'REMOVE_COUPON' });
    toast({
      title: 'Cupom removido',
      description: 'O desconto foi removido do seu pedido.',
    });
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="sticky top-0 z-10 bg-background border-b border-border">
          <div className="flex items-center p-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/')}
              className="mr-3"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-semibold">Carrinho</h1>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center py-20 px-4">
          <div className="text-center">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4 mx-auto">
              <Trash2 className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Carrinho vazio</h2>
            <p className="text-muted-foreground mb-6">Adicione produtos para continuar</p>
            <Button 
              onClick={() => navigate('/')}
              className="bg-gradient-primary"
            >
              Ver cardápio
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-32 overflow-x-hidden">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b border-border">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/')}
              className="mr-3"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-semibold">Carrinho</h1>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => clearCart()}
            className="text-destructive hover:text-destructive"
          >
            Limpar
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Cart Items */}
        {cart.map((item, index) => (
          <Card key={`${item.id}-${index}`} className="p-4 shadow-card">
            <div className="flex items-stretch gap-4">
              {/* Coluna esquerda: título, descrição, observação e ações */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground break-words">
                  {item.quantity}x {item.name}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                  {item.description}
                </p>
                {item.observation && (
                  <p className="text-sm text-primary mt-1">
                    Obs: {item.observation}
                  </p>
                )}
                <div className="mt-3 flex items-center gap-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingIndex(index)}
                  >
                    Editar
                  </Button>
                  <button
                    type="button"
                    onClick={() => {
                      if (item.quantity > 1) {
                        updateQuantity(item.id, item.quantity - 1);
                      } else {
                        removeFromCart(item.id);
                      }
                    }}
                    className="text-destructive text-sm font-medium hover:underline"
                  >
                    Remover
                  </button>
                </div>
              </div>

              {/* Coluna direita: preço no canto superior e imagem abaixo */}
              <div className="flex flex-col items-end gap-2 flex-shrink-0">
                <span className="text-primary font-bold ml-2">
                  {formatPrice(item.price * item.quantity)}
                </span>
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-20 h-20 rounded-lg object-cover"
                />
              </div>
            </div>
          </Card>
        ))}

        {/* Add More Items */}
        <Button
          variant="outline"
          onClick={() => navigate('/')}
          className="w-full max-w-full overflow-hidden border-primary text-primary hover:bg-primary/5"
        >
          <Plus className="w-4 h-4" />
          <span className="truncate">Adicionar mais itens</span>
        </Button>

        {/* Contact & Delivery preview */}
        {hasDeliveryInfo && (
          <Card className="p-4 shadow-card">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1 text-sm">
                <h3 className="font-semibold text-foreground text-base">Informações de contato e entrega</h3>
                {state.customer && (
                  <p className="text-muted-foreground">{state.customer.name} • {state.customer.phone}</p>
                )}
                {state.delivery && (
                  <p className="text-muted-foreground">
                    {state.delivery.type === 'delivery' ? (state.delivery.address || 'Endereço não informado') : 'Retirada no local'}
                  </p>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/checkout/delivery')}
              >
                Editar
              </Button>
            </div>
          </Card>
        )}

        {/* Order Summary */}
        <Card className="p-4 shadow-card">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            
            {state.appliedCoupon && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Cupom{state.appliedCoupon.code ? ` (${state.appliedCoupon.code})` : ''}
                </span>
                <span className="text-success font-medium">-{formatPrice(discount)}</span>
              </div>
            )}
            
            <Separator />
            
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span className="text-primary">{formatPrice(total)}</span>
            </div>
          </div>

          {/* Coupon Section (moved below total) */}
          <div>
            <Label className="text-sm font-medium flex items-center gap-2 mb-3">
              <Tag className="w-4 h-4" />
              Cupom de desconto
            </Label>
            {state.appliedCoupon ? (
              <div className="flex items-center justify-between p-3 bg-success/10 rounded-lg">
                <div>
                  <p className="font-medium text-success">Cupom aplicado: {state.appliedCoupon.code}</p>
                  <p className="text-sm text-muted-foreground">
                    {state.appliedCoupon.type === 'percentage' 
                      ? `${state.appliedCoupon.discount}% de desconto`
                      : `${formatPrice(state.appliedCoupon.discount)} de desconto`
                    }
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRemoveCoupon}
                  className="text-destructive hover:text-destructive"
                >
                  Remover
                </Button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Input
                  placeholder="Digite seu cupom"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1"
                />
                <Button
                  onClick={handleApplyCoupon}
                  disabled={!couponCode.trim() || isApplyingCoupon}
                  variant="outline"
                >
                  {isApplyingCoupon ? 'Aplicando...' : 'Aplicar'}
                </Button>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t border-border z-50">
        <Button
          className="w-full h-12 bg-gradient-primary hover:shadow-floating transition-all duration-300 text-lg font-semibold"
          onClick={() => navigate(hasDeliveryInfo ? '/checkout/payment' : '/checkout/delivery')}
        >
          {hasDeliveryInfo ? 'Confirmar pedido' : 'Continuar'} • {formatPrice(total)}
        </Button>
      </div>

      {/* Drawer de edição */}
      {editingIndex !== null && cart[editingIndex] && (
        <ProductModal
          product={cart[editingIndex]}
          isOpen={true}
          onClose={() => setEditingIndex(null)}
          initialQuantity={cart[editingIndex].quantity}
          initialObservation={cart[editingIndex].observation}
          confirmLabel="Atualizar"
          onConfirm={({ product, quantity, observation }) => {
            const current = cart[editingIndex!];
            // Atualiza quantidade e observação do item atual
            updateCartItem(current.id, quantity, observation);
          }}
        />
      )}
    </div>
  );
}
