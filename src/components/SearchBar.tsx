// Arquivo: SearchBar.tsx
// Comentário: Este arquivo contém lógica principal/auxiliar deste módulo. Comentários curtos foram adicionados para facilitar a leitura.

import { useRef } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchBar({ value, onChange, placeholder = "Busque por um produto" }: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const clearSearch = () => {
    onChange('');
    // Reposiciona o foco no campo para melhor UX
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  return (
    <div className="relative mx-4 mb-4">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
      <Input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10 pr-10 h-12 text-lg border-0 shadow-card focus-visible:shadow-floating transition-all duration-300"
        aria-label="Campo de busca de produtos"
      />
      {value && (
        <button
          type="button"
          onClick={clearSearch}
          aria-label="Limpar busca"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 rounded focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}