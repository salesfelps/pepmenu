// Arquivo: RestaurantHeader.tsx
// Comentário: Este arquivo contém lógica principal/auxiliar deste módulo. Comentários curtos foram adicionados para facilitar a leitura.

import { useState } from 'react';
import { Clock, MapPin, Phone, ChevronDown, ChevronUp } from 'lucide-react';
import { restaurantInfo } from '@/data/mockData';
import restaurantBanner from '@/assets/restaurant-banner.jpg';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function RestaurantHeader() {
  const [showFullDescription, setShowFullDescription] = useState(false);

  return (
    <div className="relative">
      {/* Background Image */}
      <div className="relative h-48 lg:h-64 overflow-hidden">
        <img 
          src={restaurantBanner} 
          alt="Restaurant banner" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      </div>
      
      {/* Restaurant Info Card */}
      <Card className="mx-4 -mt-20 relative z-10 shadow-floating bg-card border-0">
        <div className="p-6">
          {/* Status Badge */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${restaurantInfo.isOpen ? 'bg-success animate-bounce-subtle' : 'bg-destructive'}`} />
              <span className={`font-medium ${restaurantInfo.isOpen ? 'text-success' : 'text-destructive'}`}>
                {restaurantInfo.isOpen ? 'Aberto' : 'Fechado'}
              </span>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              className="text-muted-foreground hover:text-foreground"
            >
              <Clock className="w-4 h-4 mr-1" />
              Ver horários
            </Button>
          </div>

          {/* Restaurant Name & Location */}
          <div className="mb-4">
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
              {restaurantInfo.name}
            </h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>Centro, São Paulo - SP</span>
              </div>
              <div className="flex items-center gap-1">
                <Phone className="w-4 h-4" />
                <span>{restaurantInfo.phone}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="text-muted-foreground">
            <p className={showFullDescription ? '' : 'line-clamp-2'}>
              {restaurantInfo.description}
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFullDescription(!showFullDescription)}
              className="mt-2 p-0 h-auto text-primary hover:text-primary/80"
            >
              {showFullDescription ? (
                <>Mostrar menos <ChevronUp className="w-4 h-4 ml-1" /></>
              ) : (
                <>Ver mais <ChevronDown className="w-4 h-4 ml-1" /></>
              )}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}