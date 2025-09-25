// Arquivo: OrderHistory.tsx
// Comentário: Este arquivo contém lógica principal/auxiliar deste módulo. Comentários curtos foram adicionados para facilitar a leitura.

import { useState } from 'react';
import { ArrowLeft, Clock, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatPrice, formatDate } from '@/lib/utils';
import { Order } from '@/types';

export default function OrderHistory() {
  const navigate = useNavigate();
  const { state } = useApp();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

// Função/Classe: getStatusColor — Responsável por uma parte específica da lógica. Mantenha entradas bem definidas.
  const getStatusColor = (status: Order['status']) => {
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
  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'delivered':
        return 'Entregue';
      case 'ready':
        return 'Pronto';
      case 'preparing':
        return 'Preparando';
      case 'confirmed':
        return 'Confirmado';
      default:
        return 'Aguardando';
    }
  };

  if (state.orders.length === 0) {
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
            <h1 className="text-xl font-semibold">Histórico de pedidos</h1>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center py-20 px-4">
          <div className="text-center">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4 mx-auto">
              <Clock className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Nenhum pedido ainda</h2>
            <p className="text-muted-foreground mb-6">Seus pedidos aparecerão aqui</p>
            <Button 
              onClick={() => navigate('/')}
              className="bg-gradient-primary"
            >
              Fazer primeiro pedido
            </Button>
          </div>
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
            onClick={() => navigate('/')}
            className="mr-3"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold">Histórico de pedidos</h1>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {state.orders.map((order) => (
          <Card 
            key={order.id} 
            className="p-4 shadow-card cursor-pointer hover:shadow-product transition-all duration-300"
            onClick={() => navigate(`/order-details/${order.id}`)}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-foreground">Pedido {order.id}</h3>
                <p className="text-sm text-muted-foreground">
                  {formatDate(order.date)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={getStatusColor(order.status)}>
                  {getStatusText(order.status)}
                </Badge>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>

            <div className="space-y-2 mb-3">
              {order.items.slice(0, 2).map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {item.quantity}x {item.name}
                  </span>
                  <span>{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
              {order.items.length > 2 && (
                <p className="text-sm text-muted-foreground">
                  +{order.items.length - 2} outros itens
                </p>
              )}
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                {order.delivery.type === 'delivery' ? 'Entrega' : 'Retirada'}
              </span>
              <span className="font-bold text-primary">
                {formatPrice(order.total)}
              </span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}