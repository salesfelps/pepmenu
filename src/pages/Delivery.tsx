// Arquivo: Delivery.tsx
// Comentário: Fluxo de endereço revisado. Placeholders somem ao focar; botão alterna entre "Não sei meu CEP" e "Pesquisar por CEP".

import { useState } from 'react';
import { ArrowLeft, User, MapPin, Search, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart, useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { formatPrice } from '@/lib/utils';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';

export default function Delivery() {
  const navigate = useNavigate();
  const { getCartTotal } = useCart();
  const { state, dispatch } = useApp();
  
  const [deliveryType, setDeliveryType] = useState<'delivery' | 'pickup'>('delivery');
  const [customerName, setCustomerName] = useState(state.customer?.name || '');
  const [customerPhone, setCustomerPhone] = useState(state.customer?.phone || '');

  // CEP / Endereço
  const [addressMode, setAddressMode] = useState<'cep' | 'manual'>('cep');
  const [isSearchingCep, setIsSearchingCep] = useState(false);
  const [showAddressFields, setShowAddressFields] = useState(false);
  const [cepError, setCepError] = useState('');

  const [cep, setCep] = useState(state.delivery?.cep || '');
  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [complement, setComplement] = useState('');
  const [city, setCity] = useState('Embu das Artes');
  const [stateUF, setStateUF] = useState('SP');
  const [reference, setReference] = useState('');

  const { total } = getCartTotal();

  // Esconde placeholder ao focar; restaura ao desfocar se o campo estiver vazio.
  const handlePlaceholderFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    const el = e.currentTarget;
    if (!el.dataset.ph) el.dataset.ph = el.placeholder || '';
    el.placeholder = '';
  };
  const handlePlaceholderBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const el = e.currentTarget;
    const ph = el.dataset.ph || '';
    if (!el.value) el.placeholder = ph;
  };

  const handleContinue = () => {
    if (!customerName.trim() || !customerPhone.trim()) {
      toast({
        title: 'Dados obrigatórios',
        description: 'Por favor, preencha seu nome e telefone.',
        variant: 'destructive',
      });
      return;
    }

    if (deliveryType === 'delivery') {
      if (addressMode === 'cep' && !showAddressFields) {
        toast({
          title: 'Busque seu CEP',
          description: 'Digite o CEP e toque em Pesquisar para preencher o endereço.',
          variant: 'destructive',
        });
        return;
      }

      const requiredMissing = [street, neighborhood, number, city, stateUF].some((v) => !String(v).trim());
      if (requiredMissing) {
        toast({
          title: 'Endereço obrigatório',
          description: 'Preencha Rua, Nº, Bairro, Cidade e Estado.',
          variant: 'destructive',
        });
        return;
      }
    }

    // Save customer info
    dispatch({
      type: 'SET_CUSTOMER',
      payload: { name: customerName, phone: customerPhone }
    });

    // Save delivery info
    const fullAddress = deliveryType === 'delivery'
      ? `${street}, ${number}${complement ? ' - ' + complement : ''} - ${neighborhood}, ${city} - ${stateUF}${reference ? ` (Ref.: ${reference})` : ''}`
      : undefined;

    dispatch({
      type: 'SET_DELIVERY',
      payload: {
        type: deliveryType,
        address: fullAddress,
        cep: deliveryType === 'delivery' && addressMode === 'cep' ? cep : undefined,
      }
    });

    navigate('/checkout/payment');
  };

  const handleCepChange = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 8);
    const formatted = digits.length > 5 ? `${digits.slice(0, 5)}-${digits.slice(5)}` : digits;
    setCep(formatted);
    setCepError('');
    if (addressMode === 'cep') {
      setShowAddressFields(false);
    }
  };

  const handleCepSearch = async () => {
    const digits = cep.replace(/\D/g, '');
    if (digits.length !== 8) {
      setCepError('Digite um CEP válido (8 dígitos).');
      return;
    }

    setIsSearchingCep(true);
    setCepError('');
    try {
      const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
      const data = await res.json();
      if (data?.erro) {
        setShowAddressFields(false);
        setCepError('Endereço não encontrado.');
        return;
      }
      setStreet(data.logradouro || '');
      setNeighborhood(data.bairro || '');
      setCity(data.localidade || '');
      // Estado fixo em SP conforme requisito atual
      setStateUF('SP');
      setShowAddressFields(true);
    } catch (e) {
      setShowAddressFields(false);
      setCepError('Endereço não encontrado.');
    } finally {
      setIsSearchingCep(false);
    }
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
            <div className="relative">
              <Input
                id="name"
                type="text"
                placeholder="Nome *"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                onFocus={handlePlaceholderFocus}
                onBlur={handlePlaceholderBlur}
                className="mt-1 peer"
              />
              <span className="pointer-events-none absolute -top-2 left-2 bg-background px-1 text-xs text-muted-foreground transition-opacity peer-placeholder-shown:opacity-0 peer-focus:opacity-100">Nome</span>
            </div>
            
            <div className="relative">
              <Input
                id="phone"
                type="tel"
                placeholder="Telefone *"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                onFocus={handlePlaceholderFocus}
                onBlur={handlePlaceholderBlur}
                className="mt-1 peer"
              />
              <span className="pointer-events-none absolute -top-2 left-2 bg-background px-1 text-xs text-muted-foreground transition-opacity peer-placeholder-shown:opacity-0 peer-focus:opacity-100">Telefone</span>
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
              {addressMode === 'cep' && (
                <>
                  <div className="flex items-end gap-2">
                    <div className="relative flex-1">
                      <Input
                        id="cep"
                        type="text"
                        inputMode="numeric"
                        maxLength={9}
                        placeholder="CEP *"
                        value={cep}
                        onChange={(e) => handleCepChange(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleCepSearch();
                        }}
                        onFocus={handlePlaceholderFocus}
                        onBlur={handlePlaceholderBlur}
                        aria-invalid={!!cepError}
                        aria-describedby={cepError ? 'cep-error' : undefined}
                        className="mt-1 peer"
                      />
                      <span className="pointer-events-none absolute -top-2 left-2 bg-background px-1 text-xs text-muted-foreground transition-opacity peer-placeholder-shown:opacity-0 peer-focus:opacity-100">CEP</span>
                    </div>
                    <Button
                      onClick={handleCepSearch}
                      disabled={isSearchingCep || cep.replace(/\D/g, '').length !== 8}
                      className="shrink-0 h-10"
                      aria-busy={isSearchingCep}
                    >
                      {isSearchingCep ? (
                        <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                      ) : (
                        <Search className="w-4 h-4" aria-hidden="true" />
                      )}
                    </Button>
                  </div>
                  {cepError ? (
                    <p id="cep-error" className="text-sm text-destructive -mt-2">{cepError}</p>
                  ) : null}
                </>
              )}

              {showAddressFields && (
                <>
                  <div className="grid grid-cols-4 gap-3">
                    <div className="relative col-span-3">
                      <Input id="street" value={street} onChange={(e) => setStreet(e.target.value)} placeholder="Rua *" onFocus={handlePlaceholderFocus} onBlur={handlePlaceholderBlur} className="mt-1 peer" />
                      <span className="pointer-events-none absolute -top-2 left-2 bg-background px-1 text-xs text-muted-foreground transition-opacity peer-placeholder-shown:opacity-0 peer-focus:opacity-100">Rua</span>
                    </div>
                    <div className="relative col-span-1">
                      <Input id="number" value={number} onChange={(e) => setNumber(e.target.value)} placeholder="Nº *" onFocus={handlePlaceholderFocus} onBlur={handlePlaceholderBlur} className="mt-1 peer" />
                      <span className="pointer-events-none absolute -top-2 left-2 bg-background px-1 text-xs text-muted-foreground transition-opacity peer-placeholder-shown:opacity-0 peer-focus:opacity-100">Nº</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="relative">
                      <Input id="neighborhood" value={neighborhood} onChange={(e) => setNeighborhood(e.target.value)} placeholder="Bairro *" onFocus={handlePlaceholderFocus} onBlur={handlePlaceholderBlur} className="mt-1 peer" />
                      <span className="pointer-events-none absolute -top-2 left-2 bg-background px-1 text-xs text-muted-foreground transition-opacity peer-placeholder-shown:opacity-0 peer-focus:opacity-100">Bairro</span>
                    </div>
                    <div className="relative">
                      <Input id="complement" value={complement} onChange={(e) => setComplement(e.target.value)} placeholder="Complemento" onFocus={handlePlaceholderFocus} onBlur={handlePlaceholderBlur} className="mt-1 peer" />
                      <span className="pointer-events-none absolute -top-2 left-2 bg-background px-1 text-xs text-muted-foreground transition-opacity peer-placeholder-shown:opacity-0 peer-focus:opacity-100">Complemento</span>
                      <p className="text-xs text-muted-foreground mt-1">Exemplo: Apto/Bloco/Casa</p>
                    </div>
                    <div className="relative">
                      <Input id="reference" value={reference} onChange={(e) => setReference(e.target.value)} placeholder="Ponto de referência" onFocus={handlePlaceholderFocus} onBlur={handlePlaceholderBlur} className="mt-1 peer" />
                      <span className="pointer-events-none absolute -top-2 left-2 bg-background px-1 text-xs text-muted-foreground transition-opacity peer-placeholder-shown:opacity-0 peer-focus:opacity-100">Ponto de referência</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-3">
                    <div className="relative col-span-3">
                      <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Cidade *" onFocus={handlePlaceholderFocus} onBlur={handlePlaceholderBlur} className="mt-1 peer" />
                      <span className="pointer-events-none absolute -top-2 left-2 bg-background px-1 text-xs text-muted-foreground transition-opacity peer-placeholder-shown:opacity-0 peer-focus:opacity-100">Cidade</span>
                    </div>
                    <div className="relative col-span-1">
                      <Select value={stateUF} onValueChange={(v) => setStateUF(v)} disabled>
                        <SelectTrigger className="mt-1 [&>svg]:hidden">
                          <SelectValue placeholder="Estado *" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="AC">AC</SelectItem>
                          <SelectItem value="AL">AL</SelectItem>
                          <SelectItem value="AP">AP</SelectItem>
                          <SelectItem value="AM">AM</SelectItem>
                          <SelectItem value="BA">BA</SelectItem>
                          <SelectItem value="CE">CE</SelectItem>
                          <SelectItem value="DF">DF</SelectItem>
                          <SelectItem value="ES">ES</SelectItem>
                          <SelectItem value="GO">GO</SelectItem>
                          <SelectItem value="MA">MA</SelectItem>
                          <SelectItem value="MT">MT</SelectItem>
                          <SelectItem value="MS">MS</SelectItem>
                          <SelectItem value="MG">MG</SelectItem>
                          <SelectItem value="PA">PA</SelectItem>
                          <SelectItem value="PB">PB</SelectItem>
                          <SelectItem value="PR">PR</SelectItem>
                          <SelectItem value="PE">PE</SelectItem>
                          <SelectItem value="PI">PI</SelectItem>
                          <SelectItem value="RJ">RJ</SelectItem>
                          <SelectItem value="RN">RN</SelectItem>
                          <SelectItem value="RS">RS</SelectItem>
                          <SelectItem value="RO">RO</SelectItem>
                          <SelectItem value="RR">RR</SelectItem>
                          <SelectItem value="SC">SC</SelectItem>
                          <SelectItem value="SP">SP</SelectItem>
                          <SelectItem value="SE">SE</SelectItem>
                          <SelectItem value="TO">TO</SelectItem>
                        </SelectContent>
                      </Select>
                      <span className="pointer-events-none absolute -top-2 left-2 bg-background px-1 text-xs text-muted-foreground">Estado</span>
                    </div>
                  </div>
                </>
              )}

              <div className="pt-2 flex justify-center">
                {addressMode === 'cep' ? (
                  <button
                    type="button"
                    className="text-sm font-semibold text-primary bg-transparent p-0 h-auto focus:outline-none"
                    onClick={(e) => {
                      e.currentTarget.blur();
                      setAddressMode('manual');
                      setCep('');
                      setCepError('');
                      setShowAddressFields(true);
                    }}
                  >
                    Não sei meu CEP
                  </button>
                ) : (
                  <button
                    type="button"
                    className="text-sm font-semibold text-primary bg-transparent p-0 h-auto focus:outline-none"
                    onClick={(e) => {
                      e.currentTarget.blur();
                      setAddressMode('cep');
                      setCepError('');
                      setShowAddressFields(false);
                    }}
                  >
                    Pesquisar por CEP
                  </button>
                )}
              </div>
            </div>
          </Card>
        )}

        {/* Pickup Info */}
        {deliveryType === 'pickup' && (
          <Card className="p-4 shadow-card bg-food-bg">
            <h3 className="font-semibold mb-2">Retirada no local</h3>
            <p className="text-sm text-muted-foreground mb-2">
              R. Mal. Floriano Peixoto, 598 - Jardim Pres. Kennedy, Embu das Artes - SP, 06820-200
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
