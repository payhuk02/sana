import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/ProductCard';
import { FilterSidebar, FilterState } from '@/components/FilterSidebar';
import { SearchBar } from '@/components/SearchBar';
import { useProducts } from '@/contexts/ProductsContext';
import { Category } from '@/types/product';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const Categories = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { products, categories } = useProducts();
  const categoryParam = searchParams.get('category') as Category | null;
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 5000],
    brands: [],
    categories: categoryParam ? [categoryParam] : [],
    minRating: 0,
    inStock: false,
  });

  const availableBrands = useMemo(() => {
    return [...new Set(products.map(p => p.brand))].sort();
  }, [products]);

  const filteredProducts = useMemo(() => {
    let result = products;

    // Search
    if (searchQuery) {
      result = result.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Price range
    result = result.filter(p =>
      p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
    );

    // Brands
    if (filters.brands.length > 0) {
      result = result.filter(p => filters.brands.includes(p.brand));
    }

    // Categories
    if (filters.categories.length > 0) {
      result = result.filter(p => filters.categories.includes(p.category));
    }

    // In stock
    if (filters.inStock) {
      result = result.filter(p => p.stock > 0);
    }

    // Sort
    switch (sortBy) {
      case 'price-asc':
        result = result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result = result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result = result.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        result = result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      default:
        result = result.sort((a, b) => b.reviews - a.reviews);
    }

    return result;
  }, [searchQuery, filters, sortBy]);

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
              {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''} trouvé
              {filteredProducts.length > 1 ? 's' : ''}
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
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
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
