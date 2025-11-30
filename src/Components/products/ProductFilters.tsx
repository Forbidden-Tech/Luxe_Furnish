import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/Components/ui/select';
import { Slider } from '@/Components/ui/slider';
import { Search, SlidersHorizontal } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/Components/ui/sheet';
import type React from 'react';

const categories = [
  { value: 'all', label: 'All Categories' },
  { value: 'office_desk', label: 'Office Desks' },
  { value: 'office_chair', label: 'Office Chairs' },
  { value: 'conference_table', label: 'Conference Tables' },
  { value: 'storage', label: 'Storage' },
  { value: 'home_sofa', label: 'Sofas' },
  { value: 'home_table', label: 'Tables' },
  { value: 'home_chair', label: 'Chairs' },
  { value: 'home_bed', label: 'Beds' },
  { value: 'accessories', label: 'Accessories' },
];

export type SortOption = 'newest' | 'price_low' | 'price_high' | 'name';

export interface Filters {
  type: string;
  category: string;
  priceRange: [number, number];
  inStock: boolean;
  sort: SortOption;
}

interface ProductFiltersProps {
  filters: Filters;
  onFilterChange: <K extends keyof Filters>(key: K, value: Filters[K]) => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export default function ProductFilters({
  filters,
  onFilterChange,
  searchQuery,
  onSearchChange,
}: ProductFiltersProps) {
  const handlePriceChange = (value: number[]) => {
    if (value.length === 2) {
      onFilterChange('priceRange', [value[0], value[1]]);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
  };

  const FilterContent: React.FC = () => (
    <div className="space-y-6">
      {/* Category */}
      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">
          Category
        </label>
        <Select
          value={filters.category || 'all'}
          onValueChange={(value) => onFilterChange('category', value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat.value} value={cat.value}>
                {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Type */}
      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">
          Type
        </label>
        <div className="flex gap-2">
          {['all', 'office', 'home'].map((type) => (
            <Button
              key={type}
              variant={filters.type === type ? 'default' : 'outline'}
              size="sm"
              onClick={() => onFilterChange('type', type)}
              className={
                filters.type === type ? 'bg-gold hover:bg-[#b8944d]' : ''
              }
            >
              {type === 'all'
                ? 'All'
                : type.charAt(0).toUpperCase() + type.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <label className="text-sm font-medium text-gray-700 mb-4 block">
          Price Range: R{filters.priceRange[0]} - R{filters.priceRange[1]}
        </label>
        <Slider
          value={filters.priceRange}
          onValueChange={handlePriceChange}
          max={10000}
          min={0}
          step={100}
          className="w-full"
        />
      </div>

      {/* In Stock */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="inStock"
          checked={filters.inStock}
          onChange={(e) => onFilterChange('inStock', e.target.checked)}
          className="rounded border-gray-300 text-gold focus:ring-gold"
        />
        <label htmlFor="inStock" className="text-sm text-gray-700">
          In Stock Only
        </label>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8">
      {/* Search */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <Input
          placeholder="Search products..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="pl-10 h-12 rounded-xl"
        />
      </div>

      {/* Desktop Filters */}
      <div className="hidden lg:flex gap-4">
        <Select
          value={filters.category || 'all'}
          onValueChange={(value) => onFilterChange('category', value)}
        >
          <SelectTrigger className="w-48 h-12 rounded-xl">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat.value} value={cat.value}>
                {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.sort || 'newest'}
          onValueChange={(value) =>
            onFilterChange('sort', value as SortOption)
          }
        >
          <SelectTrigger className="w-40 h-12 rounded-xl">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="price_low">Price: Low to High</SelectItem>
            <SelectItem value="price_high">Price: High to Low</SelectItem>
            <SelectItem value="name">Name A-Z</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Mobile Filters */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" className="lg:hidden h-12 rounded-xl">
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Filter Products</SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            <FilterContent />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

