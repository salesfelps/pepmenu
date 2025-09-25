// Arquivo: CategoryNav.tsx
// Comentário: Este arquivo contém lógica principal/auxiliar deste módulo. Comentários curtos foram adicionados para facilitar a leitura.

import { useRef } from 'react';
import { categories } from '@/data/mockData';
import { Button } from '@/components/ui/button';

interface CategoryNavProps {
  activeCategory: string;
  onCategoryClick: (categoryId: string) => void;
}

export default function CategoryNav({ activeCategory, onCategoryClick }: CategoryNavProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleCategoryClick = (
    categoryId: string,
    index: number,
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    const container = scrollRef.current;
    if (container) {
      const maxScrollLeft = container.scrollWidth - container.clientWidth;

      let targetLeft = 0;

      if (index === categories.length - 1) {
        // Última categoria: encostar na direita
        targetLeft = maxScrollLeft;
      } else if (index > 0) {
        // Centralizar a categoria clicada
        const btnRect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        const offsetToCenter = (btnRect.left + btnRect.width / 2) - (containerRect.left + container.clientWidth / 2);
        targetLeft = container.scrollLeft + offsetToCenter;
        // Limitar dentro dos bounds
        targetLeft = Math.max(0, Math.min(targetLeft, maxScrollLeft));
      } else {
        // Primeira categoria: encostar à esquerda
        targetLeft = 0;
      }

      container.scrollTo({ left: targetLeft, behavior: 'smooth' });
    }

    onCategoryClick(categoryId);
  };

  return (
    <div className="sticky top-0 z-20 bg-gradient-food backdrop-blur-sm border-b border-border">
      <div ref={scrollRef} className="w-full overflow-x-auto">
        <div className="flex w-max gap-2 p-4">
          {categories.map((category, index) => (
            <Button
              key={category.id}
              variant={activeCategory === category.id ? 'default' : 'secondary'}
              size="sm"
              onClick={(e) => handleCategoryClick(category.id, index, e)}
              className={`whitespace-nowrap transition-all duration-300 ${
                activeCategory === category.id 
                  ? 'bg-gradient-primary shadow-card transform scale-105' 
                  : 'hover:shadow-card hover:scale-105'
              }`}
            >
              {category.name}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}