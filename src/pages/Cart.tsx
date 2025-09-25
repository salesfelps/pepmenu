// Arquivo: Cart.tsx
// Comentário: Este arquivo contém lógica principal/auxiliar deste módulo. Comentários curtos foram adicionados para facilitar a leitura.

import { useState } from 'react';
import { ArrowLeft, Plus, Minus, Trash2, Tag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart, useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { formatPrice } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

export default function Cart() {
  const navigate = useNavigate();
  const { cart, updateQuantity, removeFromCart, getCartTotal } = useCart();
  const { state, dispatch } = useApp();
  const [couponCode, setCouponCode] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  const { subtotal, discount, total } = getCartTotal();

// Função/Classe: handleApplyCoupon — Responsável por uma parte específica da lógica. Mantenha entradas bem definidas.
  const handleApplyCoupon = async () => {
    setIsApplyingCoupon(true);
    
    // Simulate coupon validation
    setTimeout(() => {
      if (couponCode.toLowerCase() === 'desconto10') {
        dispatch({ 
          type: 'APPLY_COUPON', 
          payload: { 
            code: couponCode, 
            discount: 10, 
            type: 'percentage', 
            isValid: true 
          } 
        });
        toast({
          title: 'Cupom aplicado!',
          description: '10% de desconto aplicado ao seu pedido.',
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
    }, 1000);
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
    <div className="min-h-screen bg-background pb-32">
      {/* Header */}
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

      <div className="p-4 space-y-4">
        {/* Cart Items */}
        {cart.map((item, index) => (
          <Card key={`${item.id}-${index}`} className="p-4 shadow-card">
            <div className="flex gap-4">
              <img 
                src={item.image} 
                alt={item.name}
                className="w-16 h-16 rounded-lg object-cover"
              />
              
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground">{item.name}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {item.description}
                </p>
                {item.observation && (
                  <p className="text-sm text-primary mt-1">
                    Obs: {item.observation}
                  </p>
                )}
                <p className="text-lg font-bold text-primary mt-2">
                  {formatPrice(item.price)}
                </p>
              </div>
              
              <div className="flex flex-col items-end gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFromCart(item.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-8 h-8"
                  >
                    <Minus className="w-3 h-3" />
                  </Button>
                  
                  <span className="text-sm font-semibold min-w-[2rem] text-center">
                    {item.quantity}
                  </span>
                  
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-8 h-8"
                  >
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}

        {/* Add More Items */}
        <Button
          variant="outline"
          onClick={() => navigate('/')}
          className="w-full border-dashed border-primary text-primary hover:bg-primary/5"
        >
          <Plus className="w-4 h-4 mr-2" />
          Adicionar mais itens
        </Button>

        {/* Coupon Section */}
        <Card className="p-4 shadow-card">
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
        </Card>

        {/* Order Summary */}
        <Card className="p-4 shadow-card">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            
            {discount > 0 && (
              <div className="flex justify-between text-success">
                <span>Desconto</span>
                <span>-{formatPrice(discount)}</span>
              </div>
            )}
            
            <Separator />
            
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span className="text-primary">{formatPrice(total)}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t border-border">
        <Button
          className="w-full h-12 bg-gradient-primary hover:shadow-floating transition-all duration-300 text-lg font-semibold"
          onClick={() => navigate('/checkout/delivery')}
        >
          Continuar • {formatPrice(total)}
        </Button>
      </div>
    </div>
  );
}