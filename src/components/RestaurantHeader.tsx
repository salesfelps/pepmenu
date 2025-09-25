// Arquivo: RestaurantHeader.tsx
// Comentário: Este arquivo contém lógica principal/auxiliar deste módulo. Comentários curtos foram adicionados para facilitar a leitura.

import { useState } from 'react';
import { Clock } from 'lucide-react';
import { restaurantInfo } from '@/data/mockData';
import restaurantBanner from '@/assets/restaurant-banner.jpg';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerClose } from '@/components/ui/drawer';
import { useNavigate } from 'react-router-dom';

export default function RestaurantHeader() {
  const navigate = useNavigate();
  const [showSchedule, setShowSchedule] = useState(false);

  // Fonte dinâmica com fallback para mock local
  const weeklySchedule = restaurantInfo.weeklySchedule ?? [
    { day: 'Segunda', hours: 'Fechado' },
    { day: 'Terça', hours: 'Fechado' },
    { day: 'Quarta', hours: 'Fechado' },
    { day: 'Quinta', hours: '18:00 - 22:00' },
    { day: 'Sexta', hours: '18:00 - 22:00' },
    { day: 'Sábado', hours: '18:00 - 22:00' },
    { day: 'Domingo', hours: '18:00 - 22:00' },
  ];


  // Cálculo de aberto/fechado com base no horário atual e agenda semanal
  const getTodayName = () => {
    const days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    return days[new Date().getDay()];
  };
  const isOpenNow = (() => {
    const today = getTodayName();
    const todayInfo = weeklySchedule.find((d) => d.day === today);
    if (!todayInfo || todayInfo.hours.toLowerCase() === 'fechado') return false;
    const match = todayInfo.hours.match(/(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})/);
    if (!match) return false;
    const [_, sh, sm, eh, em] = match;
    const start = parseInt(sh, 10) * 60 + parseInt(sm, 10);
    const end = parseInt(eh, 10) * 60 + parseInt(em, 10);
    const now = new Date();
    const current = now.getHours() * 60 + now.getMinutes();
    return current >= start && current < end;
  })();

  const nextOpening = (() => {
    // Retorna horário, em quantos dias abre e o nome do dia
    const days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    const now = new Date();
    const todayIndex = now.getDay();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    for (let i = 0; i < 7; i++) {
      const idx = (todayIndex + i) % 7;
      const dayName = days[idx];
      const info = weeklySchedule.find(d => d.day === dayName);
      if (!info || info.hours.toLowerCase() === 'fechado') continue;
      const match = info.hours.match(/(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})/);
      if (!match) continue;
      const [__, sh, sm] = match;
      const start = parseInt(sh, 10) * 60 + parseInt(sm, 10);
      if (i === 0) {
        // hoje: só se ainda não abriu
        if (currentMinutes < start) {
          return { time: `${sh}:${sm}`, daysAhead: 0, dayName } as const;
        }
      } else {
        // próximos dias: sempre retornar o start
        return { time: `${sh}:${sm}`, daysAhead: i, dayName } as const;
      }
    }
    return null;
  })();

  return (
    <div className="relative">
      {/* Background Image - menor para mobile-first */}
      <div className="relative h-36 md:h-48 overflow-hidden">
        <img 
          src={restaurantBanner} 
          alt="Restaurant banner" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      </div>
      
      {/* Restaurant Info Card - compacto por padrão */}
      <Card className="mx-4 -mt-16 md:-mt-20 relative z-10 shadow-floating bg-card border-0">
        <div className="p-4 md:p-6">
          {/* Status */}
          {isOpenNow ? (
            <div className="flex items-center justify-center mb-3 md:mb-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-success animate-bounce-subtle" />
                <span className="font-medium text-success">Aberto</span>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between mb-2 md:mb-3">
              <div className="flex flex-col items-start gap-0.5">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-destructive" />
                  <span className="font-medium text-destructive">Fechado</span>
                </div>

              </div>
              <Button 
                variant="ghost" 
                size="sm"
                className="text-muted-foreground hover:text-foreground"
                onClick={() => setShowSchedule(true)}
              >
                <Clock className="w-4 h-4 mr-1" />
                Ver horários
              </Button>
            </div>
          )}

          {/* Nome do restaurante */}
          <div className="mb-1 md:mb-2">
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground text-center">
              {restaurantInfo.name}
            </h1>
          </div>

          {/* Trecho da descrição (resumo) */}
          <div className="px-4">
            <p className="text-sm text-muted-foreground text-center line-clamp-2">
              {restaurantInfo.description}
            </p>
          </div>

          {/* Ações e informação adicional */}
          <div className="text-center">
            <div className="mt-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/info?tab=sobre')}
                className="mx-auto block p-0 h-auto text-primary hover:text-primary hover:bg-transparent focus:bg-transparent active:bg-transparent"
              >
                Mais informações
              </Button>
              {!isOpenNow && nextOpening && nextOpening.daysAhead === 0 && (
                <div className="mt-1 text-destructive font-medium">
                  {`Abre às ${nextOpening.time}`}
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
      {/* Drawer de horários (somente quando clicar em Ver horários) */}
      <Drawer open={showSchedule} onOpenChange={setShowSchedule}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Horários de funcionamento</DrawerTitle>
            <DrawerDescription>Consulte os horários por dia da semana</DrawerDescription>
          </DrawerHeader>
          <div className="px-4 pb-4">
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
          </div>
          <DrawerFooter>
            <DrawerClose className="w-full inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-primary-foreground font-medium">
              Fechar
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
}