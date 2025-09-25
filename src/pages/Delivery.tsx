// Arquivo: Delivery.tsx
// Comentário: Este arquivo contém lógica principal/auxiliar deste módulo. Comentários curtos foram adicionados para facilitar a leitura.

import { useState } from 'react';
import { ArrowLeft, User, Phone, MapPin, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart, useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { formatPrice } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

export default function Delivery() {
  const navigate = useNavigate();
  const { getCartTotal } = useCart();
  const { state, dispatch } = useApp();
  
  const [deliveryType, setDeliveryType] = useState<'delivery' | 'pickup'>('delivery');
  const [customerName, setCustomerName] = useState(state.customer?.name || '');
  const [customerPhone, setCustomerPhone] = useState(state.customer?.phone || '');
  const [address, setAddress] = useState('');
  const [cep, setCep] = useState('');

  const { total } = getCartTotal();

// Função/Classe: handleContinue — Responsável por uma parte específica da lógica. Mantenha entradas bem definidas.
  const handleContinue = () => {
    if (!customerName.trim() || !customerPhone.trim()) {
      toast({
        title: 'Dados obrigatórios',
        description: 'Por favor, preencha seu nome e telefone.',
        variant: 'destructive',
      });
      return;
    }

    if (deliveryType === 'delivery' && (!address.trim() || !cep.trim())) {
      toast({
        title: 'Endereço obrigatório',
        description: 'Por favor, preencha o endereço para entrega.',
        variant: 'destructive',
      });
      return;
    }

    // Save customer info
    dispatch({
      type: 'SET_CUSTOMER',
      payload: { name: customerName, phone: customerPhone }
    });

    // Save delivery info
    dispatch({
      type: 'SET_DELIVERY',
      payload: {
        type: deliveryType,
        address: deliveryType === 'delivery' ? address : undefined,
        cep: deliveryType === 'delivery' ? cep : undefined,
      }
    });

    navigate('/checkout/payment');
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b border-border">
        <div className="flex items-center p-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/cart')}
            className="mr-3"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold">Entrega</h1>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Customer Info */}
        <Card className="p-4 shadow-card">
          <div className="flex items-center gap-2 mb-4">
            <User className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">Dados do cliente</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Nome completo *</Label>
              <Input
                id="name"
                type="text"
                placeholder="Seu nome"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="phone">Telefone *</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="(11) 99999-9999"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
        </Card>

        {/* Delivery Type */}
        <Card className="p-4 shadow-card">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">Tipo de entrega</h2>
          </div>
          
          <RadioGroup 
            value={deliveryType} 
            onValueChange={(value) => setDeliveryType(value as 'delivery' | 'pickup')}
            className="space-y-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="delivery" id="delivery" />
              <Label htmlFor="delivery" className="flex items-center gap-2 cursor-pointer">
                <Home className="w-4 h-4" />
                Entrega à domicílio
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="pickup" id="pickup" />
              <Label htmlFor="pickup" className="cursor-pointer">
                Retirada no local
              </Label>
            </div>
          </RadioGroup>
        </Card>

        {/* Delivery Address */}
        {deliveryType === 'delivery' && (
          <Card className="p-4 shadow-card">
            <h3 className="font-semibold mb-4">Endereço de entrega</h3>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="cep">CEP *</Label>
                <Input
                  id="cep"
                  type="text"
                  placeholder="00000-000"
                  value={cep}
                  onChange={(e) => setCep(e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="address">Endereço completo *</Label>
                <Input
                  id="address"
                  type="text"
                  placeholder="Rua, número, complemento, bairro"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
          </Card>
        )}

        {/* Pickup Info */}
        {deliveryType === 'pickup' && (
          <Card className="p-4 shadow-card bg-food-bg">
            <h3 className="font-semibold mb-2">Retirada no local</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Rua das Flores, 123 - Centro, São Paulo - SP
            </p>
            <p className="text-sm text-muted-foreground">
              Tempo estimado: 20-30 minutos
            </p>
          </Card>
        )}
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t border-border">
        <div className="mb-3 text-center">
          <p className="text-lg font-bold text-primary">{formatPrice(total)}</p>
        </div>
        <Button
          className="w-full h-12 bg-gradient-primary hover:shadow-floating transition-all duration-300 text-lg font-semibold"
          onClick={handleContinue}
        >
          Continuar para pagamento
        </Button>
      </div>
    </div>
  );
}