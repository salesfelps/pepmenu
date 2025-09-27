// Arquivo: Payment.tsx
// Comentário: Este arquivo contém lógica principal/auxiliar deste módulo. Comentários curtos foram adicionados para facilitar a leitura.

import { useState } from 'react';
import { ArrowLeft, CreditCard, Smartphone, Banknote, UtensilsCrossed } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart, useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { formatPrice } from '@/lib/utils';
import { PaymentInfo } from '@/types';
import { toast } from '@/hooks/use-toast';
import { appConfig } from '@/config/app';

export default function Payment() {
  const navigate = useNavigate();
  const { getCartTotal, cart } = useCart();
  const { state, dispatch } = useApp();
  
  const hasDeliveryInfo = Boolean(state.customer && state.delivery && state.delivery.type);
  const [paymentMethod, setPaymentMethod] = useState<PaymentInfo['method'] | ''>('');
  const [isProcessing, setIsProcessing] = useState(false);

  const { total } = getCartTotal();

  const paymentOptions = [
    {
      value: 'pix' as const,
      label: 'PIX',
      icon: <Smartphone className="w-5 h-5" />,
      description: 'Pagamento instantâneo'
    },
    {
      value: 'credit' as const,
      label: 'Cartão de Crédito',
      icon: <CreditCard className="w-5 h-5" />,
      description: 'Visa, Mastercard, Elo'
    },
    {
      value: 'debit' as const,
      label: 'Cartão de Débito',
      icon: <CreditCard className="w-5 h-5" />,
      description: 'Débito na conta'
    },
    {
      value: 'meal_voucher' as const,
      label: 'Vale Refeição',
      icon: <UtensilsCrossed className="w-5 h-5" />,
      description: 'Sodexo, Ticket, Alelo'
    }
  ];

// Função/Classe: handleFinishOrder — Responsável por uma parte específica da lógica. Mantenha entradas bem definidas.
  // Gera um código curto do pedido, ex.: EMB0001, baseado no nome do restaurante
  const generateOrderCode = () => {
    const prefix = appConfig.restaurantName
      .replace(/[^A-Za-z]/g, '')
      .slice(0, 3)
      .toUpperCase();

    // Busca o maior sequencial existente com o mesmo prefixo
    const seq = state.orders
      .map(o => o.id)
      .filter(id => id.startsWith(prefix))
      .map(id => {
        const m = id.match(/^[A-Z]+(\d+)$/);
        return m ? parseInt(m[1], 10) : 0;
      })
      .reduce((max, n) => Math.max(max, n), 0) + 1;

    return `${prefix}${String(seq).padStart(4, '0')}`;
  };

  const handleFinishOrder = async () => {
    if (!paymentMethod) {
      toast({
        title: 'Selecione um método de pagamento',
        description: 'Escolha como deseja pagar seu pedido.',
        variant: 'destructive',
      });
      return;
    }

    if (!state.customer || !state.delivery) {
      toast({
        title: 'Dados incompletos',
        description: 'Verifique os dados de entrega.',
        variant: 'destructive',
      });
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      // Save payment method
      dispatch({
        type: 'SET_PAYMENT',
        payload: { method: paymentMethod }
      });

      // Create order
      const orderId = generateOrderCode();
      const order = {
        id: orderId,
        date: new Date().toISOString(),
        total,
        status: 'pending' as const,
        items: cart,
        customer: state.customer!,
        delivery: state.delivery!,
        payment: { method: paymentMethod }
      };

      dispatch({ type: 'ADD_ORDER', payload: order });

      setIsProcessing(false);
      navigate(`/order-confirmation/${orderId}`);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b border-border">
        <div className="flex items-center p-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(hasDeliveryInfo ? '/cart' : '/checkout/delivery')}
            className="mr-3"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold">Pagamento</h1>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Payment Methods */}
        <Card className="p-4 shadow-card">
          <div className="flex items-center gap-2 mb-4">
            <Banknote className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">Forma de pagamento</h2>
          </div>
          
          <RadioGroup 
            value={paymentMethod} 
            onValueChange={(value) => setPaymentMethod(value as PaymentInfo['method'])}
            className="space-y-3"
          >
            {paymentOptions.map((option) => (
              <div key={option.value} className="flex items-center space-x-3">
                <RadioGroupItem value={option.value} id={option.value} />
                <Label 
                  htmlFor={option.value} 
                  className="flex items-center gap-3 cursor-pointer flex-1 py-2"
                >
                  <div className="text-primary">
                    {option.icon}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{option.label}</div>
                    <div className="text-sm text-muted-foreground">
                      {option.description}
                    </div>
                  </div>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </Card>

        {/* Order Summary */}
        <Card className="p-4 shadow-card">
          <h3 className="font-semibold mb-4">Resumo do pedido</h3>
          
          <div className="space-y-2 mb-4">
            {cart.map((item, index) => (
              <div key={`${item.id}-${index}`} className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {item.quantity}x {item.name}
                </span>
                <span>{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>

          {state.appliedCoupon && (
            <div className="flex justify-between text-sm text-success mb-2">
              <span>Desconto ({state.appliedCoupon.code})</span>
              <span>-{formatPrice(state.appliedCoupon.type === 'percentage' 
                ? total * (state.appliedCoupon.discount / 100) 
                : state.appliedCoupon.discount
              )}</span>
            </div>
          )}

          <div className="border-t pt-2">
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span className="text-primary">{formatPrice(total)}</span>
            </div>
          </div>
        </Card>

        {/* Customer & Delivery Info */}
        <Card className="p-4 shadow-card bg-food-bg">
          <h3 className="font-semibold mb-3">Dados da entrega</h3>
          
          <div className="space-y-2 text-sm break-words">
            <div>
              <span className="text-muted-foreground">Cliente: </span>
              <span className="break-words">{state.customer?.name}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Telefone: </span>
              <span className="break-words">{state.customer?.phone}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Entrega: </span>
              <span className="break-words">
                {state.delivery?.type === 'delivery' ? 'À domicílio' : 'Retirada no local'}
              </span>
            </div>
            {state.delivery?.address && (
              <div>
                <span className="text-muted-foreground">Endereço: </span>
                <span className="block break-words whitespace-normal">{state.delivery.address}</span>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t border-border">
        <Button
          className="w-full h-12 bg-gradient-primary hover:shadow-floating transition-all duration-300 text-lg font-semibold"
          onClick={handleFinishOrder}
          disabled={!paymentMethod || isProcessing}
        >
          {isProcessing ? 'Processando...' : `Finalizar pedido • ${formatPrice(total)}`}
        </Button>
      </div>
    </div>
  );
}