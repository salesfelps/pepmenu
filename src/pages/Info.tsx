// Arquivo: Info.tsx
// Comentário: Tela de informações com abas Sobre, Horário e Pagamento. Mobile-first.

import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Phone, Smartphone, CreditCard, Wallet2, Instagram, Facebook } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import restaurantBanner from '@/assets/restaurant-banner.jpg';
import { restaurantInfo } from '@/data/mockData';

export default function Info() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const initialTab = params.get('tab') || 'sobre';

  const mapsUrl = useMemo(() => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(restaurantInfo.address)}`, []);
  const digits = restaurantInfo.phone.replace(/\D/g, '');
  const intlPhone = digits.startsWith('55') ? digits : `55${digits}`;
  const whatsappUrl = `https://wa.me/${intlPhone}?text=${encodeURIComponent('Olá! Gostaria de fazer um pedido.')}`;

  const weeklySchedule = restaurantInfo.weeklySchedule ?? [
    { day: 'Segunda', hours: 'Fechado' },
    { day: 'Terça', hours: 'Fechado' },
    { day: 'Quarta', hours: 'Fechado' },
    { day: 'Quinta', hours: '18:00 - 22:00' },
    { day: 'Sexta', hours: '18:00 - 22:00' },
    { day: 'Sábado', hours: '18:00 - 22:00' },
    { day: 'Domingo', hours: '18:00 - 22:00' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b border-border">
        <div className="flex items-center p-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="mr-3"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold">Informações</h1>
        </div>
      </div>

      <div className="p-4 space-y-4 pb-16">
        {/* Banner */}
        <div className="w-full flex items-center justify-center">
          <img src={restaurantBanner} alt="Restaurant banner" className="max-h-48 w-auto rounded-lg object-cover" />
        </div>

        {/* Tabs */}
        <Tabs defaultValue={initialTab} className="w-full">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="sobre">Sobre</TabsTrigger>
            <TabsTrigger value="horario">Horário</TabsTrigger>
            <TabsTrigger value="pagamento">Pagamento</TabsTrigger>
          </TabsList>

          <TabsContent value="sobre">
            <Card className="p-4 shadow-card">
              <h2 className="text-lg font-semibold mb-3">{restaurantInfo.name}</h2>
              <p className="text-muted-foreground mb-4">{restaurantInfo.description}</p>
              <div className="space-y-3 text-sm">
                <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  <span
                    className="text-xs leading-tight break-words"
                    style={{ display: '-webkit-box', WebkitLineClamp: 2 as any, WebkitBoxOrient: 'vertical' as any, overflow: 'hidden' }}
                  >
                    {restaurantInfo.address}
                  </span>
                </a>
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-primary hover:underline">
                  <Phone className="w-4 h-4" />
                  <span>WhatsApp: {restaurantInfo.phone}</span>
                </a>
                <div className="flex items-center gap-4 pt-1">
                  <a href="#" className="inline-flex items-center gap-2 text-primary hover:underline">
                    <Instagram className="w-4 h-4" />
                    <span>Instagram</span>
                  </a>
                  <a href="#" className="inline-flex items-center gap-2 text-primary hover:underline">
                    <Facebook className="w-4 h-4" />
                    <span>Facebook</span>
                  </a>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="horario">
            <Card className="p-4 shadow-card">
              <h2 className="text-lg font-semibold mb-3">Horários de funcionamento</h2>
              <div className="rounded-lg border bg-muted/30 text-sm divide-y">
                {weeklySchedule.map((item) => (
                  <div key={item.day} className="flex items-center justify-between px-3 py-2">
                    <span className="text-muted-foreground">{item.day}</span>
                    <span className={item.hours === 'Fechado' ? 'text-destructive font-medium' : 'font-medium'}>
                      {item.hours}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="pagamento">
            <Card className="p-4 shadow-card">
              <h2 className="text-lg font-semibold mb-3">Formas de pagamento</h2>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4" />
                  <span>PIX</span>
                </div>
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  <span>Cartão de Crédito / Débito</span>
                </div>
                <div className="flex items-center gap-2">
                  <Wallet2 className="w-4 h-4" />
                  <span>Vale Refeição (Sodexo, Ticket, Alelo)</span>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
