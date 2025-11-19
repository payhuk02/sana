import { useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Category } from '@/types/product';

interface FilterSidebarProps {
  onFilterChange: (filters: FilterState) => void;
  availableBrands: string[];
  availableCategories: { id: Category; name: string }[];
}

export interface FilterState {
  priceRange: [number, number];
  brands: string[];
  categories: Category[];
  minRating: number;
  inStock: boolean;
}

export const FilterSidebar = ({ 
  onFilterChange, 
  availableBrands,
  availableCategories 
}: FilterSidebarProps) => {
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 1000000],
    brands: [],
    categories: [],
    minRating: 0,
    inStock: false,
  });

  const handlePriceChange = (value: number[]) => {
    const newFilters = { ...filters, priceRange: [value[0], value[1]] as [number, number] };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleBrandToggle = (brand: string) => {
    const newBrands = filters.brands.includes(brand)
      ? filters.brands.filter(b => b !== brand)
      : [...filters.brands, brand];
    const newFilters = { ...filters, brands: newBrands };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleCategoryToggle = (category: Category) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...filters.categories, category];
    const newFilters = { ...filters, categories: newCategories };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleReset = () => {
    const resetFilters: FilterState = {
      priceRange: [0, 1000000],
      brands: [],
      categories: [],
      minRating: 0,
      inStock: false,
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-lg mb-4">Filtres</h3>
        <Button variant="outline" size="sm" onClick={handleReset} className="w-full">
          Réinitialiser
        </Button>
      </div>

      <Separator />

      {/* Prix */}
      <div>
        <h4 className="font-medium mb-4">Prix</h4>
        <div className="px-2">
          <Slider
            min={0}
            max={1000000}
            step={10000}
            value={filters.priceRange}
            onValueChange={handlePriceChange}
            className="mb-4"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{filters.priceRange[0]} FCFA</span>
            <span>{filters.priceRange[1]} FCFA</span>
          </div>
        </div>
      </div>

      <Separator />

      {/* Catégories */}
      {availableCategories.length > 0 && (
        <>
          <div>
            <h4 className="font-medium mb-4">Catégories</h4>
            <div className="space-y-3">
              {availableCategories.map((category) => (
                <div key={category.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category.id}`}
                    checked={filters.categories.includes(category.id)}
                    onCheckedChange={() => handleCategoryToggle(category.id)}
                  />
                  <Label
                    htmlFor={`category-${category.id}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {category.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          <Separator />
        </>
      )}

      {/* Marques */}
      <div>
        <h4 className="font-medium mb-4">Marques</h4>
        <div className="space-y-3">
          {availableBrands.map((brand) => (
            <div key={brand} className="flex items-center space-x-2">
              <Checkbox
                id={`brand-${brand}`}
                checked={filters.brands.includes(brand)}
                onCheckedChange={() => handleBrandToggle(brand)}
              />
              <Label
                htmlFor={`brand-${brand}`}
                className="text-sm font-normal cursor-pointer"
              >
                {brand}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Disponibilité */}
      <div>
        <h4 className="font-medium mb-4">Disponibilité</h4>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="in-stock"
            checked={filters.inStock}
            onCheckedChange={(checked) => {
              const newFilters = { ...filters, inStock: checked as boolean };
              setFilters(newFilters);
              onFilterChange(newFilters);
            }}
          />
          <Label htmlFor="in-stock" className="text-sm font-normal cursor-pointer">
            En stock uniquement
          </Label>
        </div>
      </div>
    </div>
  );
};
