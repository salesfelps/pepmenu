// Arquivo: OrderDetails.tsx
// Comentário: Este arquivo contém lógica principal/auxiliar deste módulo. Comentários curtos foram adicionados para facilitar a leitura.

import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageCircle, RefreshCw } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatPrice, formatDate } from '@/lib/utils';

export default function OrderDetails() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { state } = useApp();
  
  const order = state.orders.find(o => o.id === orderId);

// Função/Classe: getStatusColor — Responsável por uma parte específica da lógica. Mantenha entradas bem definidas.
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-success text-success-foreground';
      case 'ready':
        return 'bg-primary text-primary-foreground';
      case 'preparing':
        return 'bg-restaurant-orange text-white';
      case 'confirmed':
        return 'bg-restaurant-warm text-white';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

// Função/Classe: getStatusText — Responsável por uma parte específica da lógica. Mantenha entradas bem definidas.
  const getStatusText = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'Entregue';
      case 'ready':
        return 'Pronto para retirada';
      case 'preparing':
        return 'Preparando';
      case 'confirmed':
        return 'Confirmado';
      default:
        return 'Aguardando confirmação';
    }
  };

// Função/Classe: handleSendWhatsApp — Responsável por uma parte específica da lógica. Mantenha entradas bem definidas.
  const handleSendWhatsApp = () => {
    if (!order) return;

    const restaurantPhone = '5511987654321';
    const message = encodeURIComponent(
      `Olá! Gostaria de saber o status do meu pedido.\n\n` +
      `*Pedido:* ${order.id}\n` +
      `*Cliente:* ${order.customer.name}\n` +
      `*Telefone:* ${order.customer.phone}\n\n` +
      `Obrigado!`
    );

    window.open(`https://wa.me/${restaurantPhone}?text=${message}`, '_blank');
  };

  if (!order) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-xl font-semibold mb-4">Pedido não encontrado</h1>
          <Button onClick={() => navigate('/order-history')}>
            Voltar ao histórico
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b border-border">
        <div className="flex items-center p-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/order-history')}
            className="mr-3"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold">Detalhes do pedido</h1>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Order Header */}
        <Card className="p-4 shadow-card">
          <div className="text-center mb-4">
            <h2 className="text-lg font-semibold">Pedido {order.id}</h2>
            <p className="text-sm text-muted-foreground">
              {formatDate(order.date)}
            </p>
          </div>

          <div className="flex justify-center mb-4">
            <Badge className={`${getStatusColor(order.status)} text-lg px-4 py-2`}>
              {getStatusText(order.status)}
            </Badge>
          </div>

          <div className="text-center">
            <p className="text-2xl font-bold text-primary">{formatPrice(order.total)}</p>
          </div>
        </Card>

        {/* Order Items */}
        <Card className="p-4 shadow-card">
          <h3 className="font-semibold mb-4">Itens do pedido</h3>
          <div className="space-y-4">
            {order.items.map((item, index) => (
              <div key={`${item.id}-${index}`} className="flex gap-3">
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {item.quantity}x {formatPrice(item.price)}
                      </p>
                      {item.observation && (
                        <p className="text-sm text-primary mt-1">
                          Obs: {item.observation}
                        </p>
                      )}
                    </div>
                    <span className="font-medium">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Customer & Delivery Info */}
        <Card className="p-4 shadow-card">
          <h3 className="font-semibold mb-4">Informações da entrega</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Cliente:</span>
              <span className="font-medium">{order.customer.name}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-muted-foreground">Telefone:</span>
              <span className="font-medium">{order.customer.phone}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tipo:</span>
              <span className="font-medium">
                {order.delivery.type === 'delivery' ? 'Entrega à domicílio' : 'Retirada no local'}
              </span>
            </div>

            {order.delivery.address && (
              <div className="flex justify-between items-start">
                <span className="text-muted-foreground">Endereço:</span>
                <span className="font-medium text-right max-w-[60%]">
                  {order.delivery.address}
                </span>
              </div>
            )}
            
            <div className="flex justify-between">
              <span className="text-muted-foreground">Pagamento:</span>
              <span className="font-medium capitalize">
                {order.payment.method === 'pix' ? 'PIX' :
                 order.payment.method === 'credit' ? 'Cartão de Crédito' :
                 order.payment.method === 'debit' ? 'Cartão de Débito' :
                 'Vale Refeição'}
              </span>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3 pb-8">
          <Button
            className="w-full h-12 bg-gradient-warm hover:shadow-floating transition-all duration-300"
            onClick={handleSendWhatsApp}
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            Entrar em contato via WhatsApp
          </Button>
          
          <Button
            variant="outline"
            className="w-full h-12 border-primary text-primary hover:bg-primary/5"
            onClick={() => navigate('/')}
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Fazer novo pedido
          </Button>
        </div>
      </div>
    </div>
  );
}