// Arquivo: Menu.tsx
// Comentário: Este arquivo contém lógica principal/auxiliar deste módulo. Comentários curtos foram adicionados para facilitar a leitura.

import { useState, useEffect, useRef } from 'react';
import { Product } from '@/types';
import { categories, products } from '@/data/mockData';
import RestaurantHeader from '@/components/RestaurantHeader';
import SearchBar from '@/components/SearchBar';
import CategoryNav from '@/components/CategoryNav';
import ProductCard from '@/components/ProductCard';
import ProductModal from '@/components/ProductModal';
import FloatingCart from '@/components/FloatingCart';

export default function Menu() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState(categories[0]?.id || '');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  // Evita que o scroll programático (ao clicar na categoria) seja sobrescrito pelo listener de scroll
  const isProgrammaticScrollRef = useRef(false);
  const scrollUnlockTimeoutRef = useRef<number | null>(null);
  const scrollUnlockRafRef = useRef<number | null>(null);

  const filteredProducts = products.filter(product => {
    const normalize = (s: string) => s
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, ''); // remove acentos/diacríticos

    const term = normalize(searchTerm);
    const categoryName = normalize(categories.find(c => c.id === product.category)?.name || '');

    const matchesSearch = searchTerm === '' || 
      normalize(product.name).includes(term) ||
      normalize(product.description).includes(term) ||
      categoryName.includes(term);
    
    const matchesCategory = searchTerm === '' ? product.category === activeCategory : true;
    
    return matchesSearch && matchesCategory;
  });

// Função/Classe: handleProductClick — Responsável por uma parte específica da lógica. Mantenha entradas bem definidas.
  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

// Função/Classe: handleCategoryClick — Responsável por uma parte específica da lógica. Mantenha entradas bem definidas.
  const handleCategoryClick = (categoryId: string) => {
    setActiveCategory(categoryId);
    setSearchTerm(''); // Clear search when changing category

    const section = document.getElementById(`category-${categoryId}`);
    const nav = document.getElementById('category-nav');

    if (section) {
      const navHeight = nav?.getBoundingClientRect().height ?? 0;
      const rect = section.getBoundingClientRect();
      // Fudge adicional de 4px para garantir que o topo da seção passe do limite do sticky
      const targetTop = window.scrollY + rect.top - navHeight - 12; // 12px = 8px base + 4px folga

      // Trava temporariamente o listener de scroll para não "puxar" a categoria errada durante a animação
      isProgrammaticScrollRef.current = true;
      if (scrollUnlockTimeoutRef.current) {
        window.clearTimeout(scrollUnlockTimeoutRef.current);
        scrollUnlockTimeoutRef.current = null;
      }
      if (scrollUnlockRafRef.current) {
        cancelAnimationFrame(scrollUnlockRafRef.current);
        scrollUnlockRafRef.current = null;
      }

      // Fallback de segurança para desbloquear mesmo que não atinja exatamente o alvo
      scrollUnlockTimeoutRef.current = window.setTimeout(() => {
        isProgrammaticScrollRef.current = false;
      }, 1500);

      // Observa até a rolagem "assentar" próxima ao alvo
      const watch = () => {
        const navNow = document.getElementById('category-nav');
        const h = navNow?.getBoundingClientRect().height ?? 0;
        const anchor = h + 8;
        const r = section.getBoundingClientRect();
        const diff = Math.abs(r.top - anchor);
        const atBottom = window.innerHeight + window.scrollY >= (document.documentElement.scrollHeight - 2);
        if (diff <= 6 || atBottom) {
          // desbloqueia e limpa timeouts/raf
          isProgrammaticScrollRef.current = false;
          if (scrollUnlockTimeoutRef.current) {
            window.clearTimeout(scrollUnlockTimeoutRef.current);
            scrollUnlockTimeoutRef.current = null;
          }
          if (scrollUnlockRafRef.current) {
            cancelAnimationFrame(scrollUnlockRafRef.current);
            scrollUnlockRafRef.current = null;
          }
          return;
        }
        scrollUnlockRafRef.current = requestAnimationFrame(watch);
      };
      scrollUnlockRafRef.current = requestAnimationFrame(watch);

      window.scrollTo({ top: targetTop, behavior: 'smooth' });
    }
  };

  // Update active category based on scroll position
  useEffect(() => {
// Função/Classe: handleScroll — Responsável por uma parte específica da lógica. Mantenha entradas bem definidas.
    const handleScroll = () => {
      if (searchTerm !== '') return; // Don't update category while searching
      if (isProgrammaticScrollRef.current) return; // Ignora atualização durante rolagem programática

      const nav = document.getElementById('category-nav');
      const navHeight = nav?.getBoundingClientRect().height ?? 0;
      const anchor = navHeight + 8; // ponto de referência logo abaixo do menu

      const categoryElements = categories.map(category => ({
        id: category.id,
        element: document.getElementById(`category-${category.id}`)
      })).filter(item => item.element) as { id: string; element: HTMLElement }[];

      // Nova regra: escolher a seção cujo topo está mais PRÓXIMO do anchor (abaixo do sticky)
      let currentId = categories[0]?.id || '';
      let minDistance = Infinity;

      categoryElements.forEach(({ id, element }) => {
        const rect = element.getBoundingClientRect();
        const distance = Math.abs(rect.top - anchor);
        if (distance < minDistance) {
          minDistance = distance;
          currentId = id;
        }
      });

      // Se está no final da página, força a última categoria
      const atBottom = window.innerHeight + window.scrollY >= (document.documentElement.scrollHeight - 2);
      if (atBottom) {
        currentId = categories[categories.length - 1]?.id || currentId;
      }

      setActiveCategory(currentId);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [searchTerm]);

  // Cleanup timers/raf on unmount
  useEffect(() => {
    return () => {
      if (scrollUnlockTimeoutRef.current) {
        window.clearTimeout(scrollUnlockTimeoutRef.current);
      }
      if (scrollUnlockRafRef.current) {
        cancelAnimationFrame(scrollUnlockRafRef.current);
      }
    };
  }, []);

// Função/Classe: renderProducts — Responsável por uma parte específica da lógica. Mantenha entradas bem definidas.
  const renderProducts = () => {
    if (searchTerm) {
      // Show search results
      return (
        <div className="px-4 pb-0 mb-8">
          <h2 className="text-xl font-bold mb-4 text-foreground">
            Resultados da busca "{searchTerm}"
          </h2>
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onProductClick={handleProductClick}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Nenhum produto encontrado</p>
            </div>
          )}
        </div>
      );
    }

    // Show products by category
    return (
      <div className="pb-0">
        {categories.map(category => (
          <div key={category.id} id={`category-${category.id}`} className="mb-8">
            <div className="px-4 mb-4">
              <h2 className="text-2xl font-bold text-foreground">{category.name}</h2>
            </div>
            <div className="px-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {category.products.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onProductClick={handleProductClick}
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <RestaurantHeader />
      
      <div className="mt-4 pb-16">
        <SearchBar 
          value={searchTerm}
          onChange={setSearchTerm}
        />
        
        <CategoryNav 
          activeCategory={activeCategory}
          onCategoryClick={handleCategoryClick}
        />
        
        <div className="mt-4">
          {renderProducts()}
          <footer className="px-4 py-8 text-center text-xs text-muted-foreground bg-primary/5">
            <p className="mb-1">Emburguer Fast - 2017. Todos os direitos reservados.</p>
            <p className="mb-1">CNPJ: ....</p>
            <p className="mb-3">Endereço: ....</p>
            <p>
              Plataforma fornecida por <a href="https://app.pepchat.com.br/" target="_blank" rel="noopener noreferrer" className="font-semibold text-foreground">PepChat</a>.
            </p>
          </footer>
        </div>
      </div>

      <FloatingCart />

      <ProductModal
        product={selectedProduct}
        isOpen={isProductModalOpen}
        onClose={() => {
          setIsProductModalOpen(false);
          setSelectedProduct(null);
        }}
      />
    </div>
  );
}