import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/ProductCard';
import { FilterSidebar, FilterState } from '@/components/FilterSidebar';
import { SearchBar } from '@/components/SearchBar';
import { useProducts } from '@/contexts/ProductsContext';
import { Category, Product } from '@/types/product';
import { fetchProductsPaginated, fetchAvailableBrands, ProductFilters, ProductSort } from '@/lib/products';
import { Loader2 } from 'lucide-react';
import { ProductCardSkeleton } from '@/components/ProductCardSkeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useDebounce } from '@/hooks/useDebounce';
import { Breadcrumbs } from '@/components/Breadcrumbs';

const ITEMS_PER_PAGE = 12;

const Categories = () => {
  const [searchParams] = useSearchParams();
  const { categories } = useProducts();
  const categoryParam = searchParams.get('category') as Category | null;
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [sortBy, setSortBy] = useState('popular');
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 5000],
    brands: [],
    categories: categoryParam ? [categoryParam] : [],
    minRating: 0,
    inStock: false,
  });

  // État pour les produits paginés
  const [products, setProducts] = useState<Product[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [availableBrands, setAvailableBrands] = useState<string[]>([]);

  // Récupérer les marques disponibles au chargement
  useEffect(() => {
    fetchAvailableBrands().then(setAvailableBrands);
  }, []);

  // Convertir le tri local en format serveur
  const getSortConfig = (): ProductSort => {
    switch (sortBy) {
      case 'price-asc':
        return { field: 'price', order: 'asc' };
      case 'price-desc':
        return { field: 'price', order: 'desc' };
      case 'rating':
        return { field: 'rating', order: 'desc' };
      case 'newest':
        return { field: 'reviews', order: 'desc', isNew: true };
      default:
        return { field: 'reviews', order: 'desc' };
    }
  };

  // Convertir les filtres locaux en format serveur
  const getServerFilters = (): ProductFilters => {
    const serverFilters: ProductFilters = {};

    if (debouncedSearchQuery) {
      serverFilters.search = debouncedSearchQuery;
    }

    if (filters.categories.length > 0) {
      serverFilters.category = filters.categories.length === 1 
        ? filters.categories[0] 
        : filters.categories;
    }

    if (filters.brands.length > 0) {
      serverFilters.brands = filters.brands;
    }

    if (filters.priceRange[0] > 0) {
      serverFilters.priceMin = filters.priceRange[0];
    }

    if (filters.priceRange[1] < 5000) {
      serverFilters.priceMax = filters.priceRange[1];
    }

    if (filters.minRating > 0) {
      serverFilters.minRating = filters.minRating;
    }

    if (filters.inStock) {
      serverFilters.inStock = true;
    }

    return serverFilters;
  };

  // Charger les produits avec pagination côté serveur
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const serverFilters = getServerFilters();
        const sortConfig = getSortConfig();
        
        const result = await fetchProductsPaginated(
          currentPage,
          ITEMS_PER_PAGE,
          serverFilters,
          sortConfig
        );

        setProducts(result.products);
        setTotalProducts(result.total);
        setTotalPages(result.totalPages);
      } catch (error) {
        console.error('Error loading products:', error);
        setProducts([]);
        setTotalProducts(0);
        setTotalPages(0);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [currentPage, debouncedSearchQuery, filters, sortBy]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchQuery, filters, sortBy]);

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  const FilterContent = (
    <FilterSidebar
      onFilterChange={handleFilterChange}
      availableBrands={availableBrands}
      availableCategories={categories}
    />
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: 'Catégories', href: categoryParam ? '/categories' : undefined },
            ...(categoryParam
              ? [{ label: categories.find(c => c.id === categoryParam)?.name || 'Produits' }]
              : [])
          ]}
        />

        {/* Search Bar */}
        <div className="mb-8">
          <SearchBar onSearch={setSearchQuery} />
        </div>

        {/* Title & Sort */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {categoryParam
                ? categories.find(c => c.id === categoryParam)?.name || 'Produits'
                : 'Tous les produits'}
            </h1>
            <p className="text-muted-foreground">
              {totalProducts} produit{totalProducts > 1 ? 's' : ''} trouvé{totalProducts > 1 ? 's' : ''}
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Mobile Filter Button */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="md:hidden">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtres
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80">
                {FilterContent}
              </SheetContent>
            </Sheet>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Trier par" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popular">Populaire</SelectItem>
                <SelectItem value="newest">Nouveautés</SelectItem>
                <SelectItem value="price-asc">Prix croissant</SelectItem>
                <SelectItem value="price-desc">Prix décroissant</SelectItem>
                <SelectItem value="rating">Mieux notés</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Products Grid with Sidebar */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden md:block w-64 flex-shrink-0">
            <div className="sticky top-24">{FilterContent}</div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : products.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-8">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    
                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                        // Show first page, last page, current page, and pages around current
                        if (
                          page === 1 ||
                          page === totalPages ||
                          (page >= currentPage - 1 && page <= currentPage + 1)
                        ) {
                          return (
                            <Button
                              key={page}
                              variant={currentPage === page ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => setCurrentPage(page)}
                              className="min-w-[40px]"
                            >
                              {page}
                            </Button>
                          );
                        } else if (
                          page === currentPage - 2 ||
                          page === currentPage + 2
                        ) {
                          return (
                            <span key={page} className="px-2">
                              ...
                            </span>
                          );
                        }
                        return null;
                      })}
                    </div>

                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}

                <div className="text-center mt-4 text-sm text-muted-foreground">
                  Affichage de {products.length} sur {totalProducts} produit{totalProducts > 1 ? 's' : ''}
                </div>
              </>
            ) : (
              <div className="text-center py-16">
                <p className="text-lg text-muted-foreground">
                  Aucun produit ne correspond à votre recherche.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Categories;
