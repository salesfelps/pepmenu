// Arquivo: CategoryNav.tsx
// Comentário: Este arquivo contém lógica principal/auxiliar deste módulo. Comentários curtos foram adicionados para facilitar a leitura.

import { categories } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface CategoryNavProps {
  activeCategory: string;
  onCategoryClick: (categoryId: string) => void;
}

export default function CategoryNav({ activeCategory, onCategoryClick }: CategoryNavProps) {
  return (
    <div className="sticky top-0 z-20 bg-gradient-food backdrop-blur-sm border-b border-border">
      <ScrollArea className="w-full">
        <div className="flex gap-2 p-4 min-w-max">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={activeCategory === category.id ? 'default' : 'secondary'}
              size="sm"
              onClick={() => onCategoryClick(category.id)}
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
      </ScrollArea>
    </div>
  );
}