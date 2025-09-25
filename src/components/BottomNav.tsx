// Arquivo: BottomNav.tsx
// Comentário: Este arquivo contém lógica principal/auxiliar deste módulo. Comentários curtos foram adicionados para facilitar a leitura.

import { Home, Clock, ShoppingBag } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { getCartItemCount } = useCart();
  const itemCount = getCartItemCount();

  // Don't show bottom nav on certain pages
  if (location.pathname.includes('/checkout/') || 
      location.pathname.includes('/order-confirmation') ||
      location.pathname.includes('/order-details')) {
    return null;
  }

  const navItems = [
    {
      label: 'Cardápio',
      icon: Home,
      path: '/',
      active: location.pathname === '/'
    },
    {
      label: 'Pedidos',
      icon: Clock,
      path: '/order-history',
      active: location.pathname === '/order-history'
    },
    {
      label: 'Carrinho',
      icon: ShoppingBag,
      path: '/cart',
      active: location.pathname === '/cart',
      badge: itemCount > 0 ? itemCount : undefined
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-40 pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-around py-1">
        {navItems.map((item) => (
          <Button
            key={item.path}
            variant="ghost"
            className={`flex flex-col gap-1 h-auto py-3 px-6 ${
              item.active 
                ? 'text-primary bg-primary/10' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
            onClick={() => navigate(item.path)}
          >
            <div className="relative">
              <item.icon className="w-5 h-5" />
              {item.badge && (
                <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                  {item.badge}
                </div>
              )}
            </div>
            <span className="text-xs font-medium">{item.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}