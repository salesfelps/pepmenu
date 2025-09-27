// Arquivo: OrderConfirmation.tsx
// Comentário: Este arquivo contém lógica principal/auxiliar deste módulo. Comentários curtos foram adicionados para facilitar a leitura.

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, MessageCircle, Home } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { formatPrice, formatDate } from '@/lib/utils';
import { appConfig } from '@/config/app';

export default function OrderConfirmation() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { state } = useApp();
  const [order, setOrder] = useState(state.orders.find(o => o.id === orderId));

  useEffect(() => {
    const foundOrder = state.orders.find(o => o.id === orderId);
    setOrder(foundOrder);
  }, [state.orders, orderId]);

  // Foca no topo ao entrar na tela de sucesso
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

// Função/Classe: handleSendWhatsApp — Responsável por uma parte específica da lógica. Mantenha entradas bem definidas.
  const handleSendWhatsApp = () => {
    if (!order) return;

    const restaurantPhone = appConfig.whatsappPhone.startsWith('55') ? appConfig.whatsappPhone : `55${appConfig.whatsappPhone}`;

    const statusText = (() => {
      switch (order.status) {
        case 'pending':
          return 'Em confirmação';
        case 'confirmed':
        case 'preparing':
          return 'Em preparação';
        case 'on_route':
          return 'A caminho';
        case 'ready':
          return 'Pronto para retirar';
        case 'delivered':
          return 'Entregue';
        case 'canceled':
          return 'Cancelado';
        default:
          return 'Em confirmação';
      }
    })();

    const entregaLinha = order.delivery.type === 'delivery'
      ? `*Entrega:* À domicílio\n*Endereço:* ${order.delivery.address || '—'}`
      : `*Entrega:* Retirada no local`;

    const itensLinha = order.items
      .map(item => `• ${item.quantity}x ${item.name}${item.observation ? ` (${item.observation})` : ''}`)
      .join('\n');

    const intro = (() => {
      switch (order.status) {
        case 'pending':
          return 'Olá! Fiz um pedido e ele está em confirmação.';
        case 'confirmed':
        case 'preparing':
          return 'Olá! Fiz um pedido e ele está em preparação.';
        case 'on_route':
          return 'Olá! Fiz um pedido e ele está a caminho.';
        case 'ready':
          return 'Olá! Fiz um pedido e gostaria de confirmar a retirada.';
        default:
          return 'Olá! Fiz um pedido e gostaria de confirmar algumas informações.';
      }
    })();

    const message = encodeURIComponent(
      `${intro}\n\n` +
      `*Pedido:* ${order.id}\n` +
      `*Status atual:* ${statusText}\n` +
      `*Total:* ${formatPrice(order.total)}\n` +
      `*Cliente:* ${order.customer.name}\n` +
      `*Telefone:* ${order.customer.phone}\n` +
      `${entregaLinha}\n\n` +
      `*Itens:*\n${itensLinha}`
    );

    window.open(`https://wa.me/${restaurantPhone}?text=${message}`, '_blank');
  };

  if (!order) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-xl font-semibold mb-4">Pedido não encontrado</h1>
          <Button onClick={() => navigate('/')}>
            Voltar ao cardápio
          </Button>
        </div>
      </div>
    );
  }

  // Define título do cabeçalho conforme o status do pedido
  const headerTitle = (() => {
    switch (order.status) {
      case 'pending':
        return 'Pedido recebido';
      case 'confirmed':
      case 'preparing':
        return 'Pedido confirmado';
      case 'on_route':
        return 'Pedido a caminho';
      case 'ready':
        return 'Pedido pronto';
      case 'delivered':
        return 'Pedido entregue';
      case 'canceled':
        return 'Pedido cancelado';
      default:
        return 'Pedido';
    }
  })();

  return (
    <div className="min-h-screen bg-background">
      <div className="p-4 space-y-6">
        {/* Success Header */}
        <div className="text-center py-8">
          <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-12 h-12 text-success" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            {headerTitle}
          </h1>
          {order.status === 'pending' && (
            <p className="text-muted-foreground">
              Seu pedido foi recebido e logo será preparado.
            </p>
          )}
        </div>

        {/* Order Info */}
        <Card className="p-4 shadow-card">
          <div className="text-center mb-4">
            <h2 className="text-lg font-semibold">Número do pedido</h2>
            <p className="text-2xl font-bold text-primary">{order.id}</p>
            <p className="text-sm text-muted-foreground mt-1">
              {formatDate(order.date)}
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Status:</span>
              <span className="font-medium text-restaurant-orange">
                {order.status === 'pending' ? 'Em confirmação' :
                 order.status === 'confirmed' ? 'Em preparação' :
                 order.status === 'preparing' ? 'Em preparação' :
                 order.status === 'on_route' ? 'A caminho' :
                 order.status === 'ready' ? 'Pronto para retirar' :
                 order.status === 'delivered' ? 'Entregue' :
                 order.status === 'canceled' ? 'Cancelado' : order.status}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Total:</span>
              <span className="font-bold text-primary">{formatPrice(order.total)}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Entrega:</span>
              <span className="font-medium">
                {order.delivery.type === 'delivery' ? 'À domicílio' : 'Retirada no local'}
              </span>
            </div>

            <div className="flex justify-between items-center">
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

        {/* Order Items */}
        <Card className="p-4 shadow-card">
          <h3 className="font-semibold mb-4">Itens do pedido</h3>
          <div className="space-y-3">
            {order.items.map((item, index) => (
              <div key={`${item.id}-${index}`}>
                <div className="flex justify-between">
                  <div className="flex-1">
                    <p className="font-medium">{item.quantity}x {item.name}</p>
                    {item.selectedAddons && item.selectedAddons.length > 0 && (
                      <div className="pl-4 text-xs text-muted-foreground">
                        {item.selectedAddons.map((a,i)=>(
                          <div key={i}>+ {a.name} ({formatPrice(a.price)})</div>
                        ))}
                      </div>
                    )}
                    {item.observation && (
                      <p className="text-sm text-muted-foreground">
                        Obs: {item.observation}
                      </p>
                    )}
                  </div>
                  <span className="font-medium">
                    {formatPrice((item.price + (item.selectedAddons || []).reduce((s,a)=>s+a.price,0)) * item.quantity)}
                  </span>
                </div>
              </div>
            ))}

            {order.delivery.type === 'delivery' && order.delivery.address && (
              <div className="flex justify-between pt-2 border-t">
                <span className="text-muted-foreground">Taxa de entrega</span>
                <span className="font-medium">{formatPrice(appConfig.deliveryFee)}</span>
              </div>
            )}
          </div>
        </Card>

        {/* Customer Info */}
        <Card className="p-4 shadow-card bg-food-bg">
          <h3 className="font-semibold mb-3">Dados do pedido</h3>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-muted-foreground">Cliente: </span>
              <span>{order.customer.name}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Telefone: </span>
              <span>{order.customer.phone}</span>
            </div>
            {order.delivery.address && (
              <div>
                <span className="text-muted-foreground">Endereço: </span>
                <span>{order.delivery.address}</span>
              </div>
            )}
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3 pb-8">
          {(order.status !== 'delivered' && order.status !== 'canceled') && (
            <Button
              className="w-full h-12 bg-gradient-warm hover:shadow-floating transition-all duration-300"
              onClick={handleSendWhatsApp}
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Enviar pedido via WhatsApp
            </Button>
          )}
          
          <Button
            variant="outline"
            className="w-full h-12 border-primary text-primary hover:bg-primary/5"
            onClick={() => navigate('/')}
          >
            <Home className="w-5 h-5 mr-2" />
            Voltar ao cardápio
          </Button>
        </div>
      </div>
    </div>
  );
}