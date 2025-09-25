// Arquivo: Menu.tsx
// Comentário: Este arquivo contém lógica principal/auxiliar deste módulo. Comentários curtos foram adicionados para facilitar a leitura.

import { useState, useEffect } from 'react';
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
    
    // Scroll to category section
    const element = document.getElementById(`category-${categoryId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Update active category based on scroll position
  useEffect(() => {
// Função/Classe: handleScroll — Responsável por uma parte específica da lógica. Mantenha entradas bem definidas.
    const handleScroll = () => {
      if (searchTerm !== '') return; // Don't update category while searching
      
      const categoryElements = categories.map(category => ({
        id: category.id,
        element: document.getElementById(`category-${category.id}`)
      })).filter(item => item.element);

      let closestCategory = categories[0]?.id;
      let minDistance = Infinity;

      categoryElements.forEach(({ id, element }) => {
        if (element) {
          const rect = element.getBoundingClientRect();
          const distance = Math.abs(rect.top - 200); // 200px offset for header
          
          if (distance < minDistance) {
            minDistance = distance;
            closestCategory = id;
          }
        }
      });

      setActiveCategory(closestCategory);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [searchTerm]);

// Função/Classe: renderProducts — Responsável por uma parte específica da lógica. Mantenha entradas bem definidas.
  const renderProducts = () => {
    if (searchTerm) {
      // Show search results
      return (
        <div className="px-4 pb-24">
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
      <div className="pb-24">
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