import React, { useState, useMemo, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import ProductCard from '../Components/products/ProductCard';
import ProductFilters from '../Components/products/ProductFilters';
import { Button } from '@/Components/ui/button';
import { Skeleton } from '@/Components/ui/skeleton';
import { toast } from 'sonner';
import { ShoppingCart, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ---- Types ----

interface Product {
  id: string | number;
  name: string;
  description?: string | null;
  category?: string | null;
  type?: string | null;
  price: number;
  in_stock?: boolean;
}

type SortOption = 'newest' | 'price_low' | 'price_high' | 'name';

interface Filters {
  type: string; // 'all' | 'office' | 'home' | etc.
  category: string; // 'all' or category key
  priceRange: [number, number];
  inStock: boolean;
  sort: SortOption;
}

interface QuoteItem {
  product_id: Product['id'];
  product_name: string;
  quantity: number;
  unit_price: number;
  total: number;
}

// ---- Component ----

const Products: React.FC = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const initialType = urlParams.get('type') || 'all';
  const initialCategory = urlParams.get('category') || 'all';

  const [filters, setFilters] = useState<Filters>({
    type: initialType,
    category: initialCategory,
    priceRange: [0, 10000],
    inStock: false,
    sort: 'newest',
  });

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [quoteItems, setQuoteItems] = useState<QuoteItem[]>([]);

  const { data: products = [], isLoading } = useQuery<Product[], Error>({
    queryKey: ['products'],
    queryFn: async () => {
      const res = await base44.entities.Product.list('-created_date', 100);
      // Adjust if your API returns { results: Product[] } etc.
      return res as Product[];
    },
  });

  // Load existing quote items from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('quoteItems');
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as QuoteItem[];
        if (Array.isArray(parsed)) {
          setQuoteItems(parsed);
        }
      } catch (err) {
        console.error('Failed to parse quoteItems from localStorage', err);
      }
    }
  }, []);

  const filteredProducts = useMemo(() => {
    let result: Product[] = [...products];

    // Search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter((p) => {
        const name = p.name?.toLowerCase() ?? '';
        const desc = p.description?.toLowerCase() ?? '';
        const cat = p.category?.toLowerCase() ?? '';
        return (
          name.includes(query) ||
          desc.includes(query) ||
          cat.includes(query)
        );
      });
    }

    // Type filter
    if (filters.type !== 'all') {
      result = result.filter((p) => p.type === filters.type);
    }

    // Category filter
    if (filters.category !== 'all') {
      result = result.filter((p) => p.category === filters.category);
    }

    // Price filter
    result = result.filter(
      (p) =>
        p.price >= filters.priceRange[0] &&
        p.price <= filters.priceRange[1]
    );

    // In stock filter
    if (filters.inStock) {
      result = result.filter((p) => p.in_stock !== false);
    }

    // Sort
    switch (filters.sort) {
      case 'price_low':
        result.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price_high':
        result.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'name':
        result.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        break;
      case 'newest':
      default:
        // Assuming API already returns newest first
        break;
    }

    return result;
  }, [products, filters, searchQuery]);

  const handleFilterChange = <K extends keyof Filters>(
    key: K,
    value: Filters[K]
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleAddToQuote = (product: Product) => {
    const existingItems: QuoteItem[] = JSON.parse(
      localStorage.getItem('quoteItems') || '[]'
    );

    const exists = existingItems.find(
      (item) => item.product_id === product.id
    );

    if (exists) {
      toast.info('Product already in quote builder');
      return;
    }

    const newItem: QuoteItem = {
      product_id: product.id,
      product_name: product.name,
      quantity: 1,
      unit_price: product.price,
      total: product.price,
    };

    const updatedItems = [...existingItems, newItem];
    localStorage.setItem('quoteItems', JSON.stringify(updatedItems));
    setQuoteItems(updatedItems);
    toast.success('Added to quote builder');
  };

  return (
    <div className="min-h-screen bg-stone-50 pt-24">
      {/* Hero */}
      <div className="bg-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="text-gold text-sm font-semibold uppercase tracking-wider">
              Our Collection
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-white mt-3">
              {filters.type === 'office'
                ? 'Office Furniture'
                : filters.type === 'home'
                  ? 'Home Furniture'
                  : 'All Products'}
            </h1>
            <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
              Discover our curated collection of premium furniture designed for
              modern living and working spaces.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filters */}
        <ProductFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Results Count */}
        <div className="flex items-center justify-between mb-8">
          <p className="text-gray-600">
            Showing{' '}
            <span className="font-semibold text-gray-900">
              {filteredProducts.length}
            </span>{' '}
            products
          </p>

          {quoteItems.length > 0 && (
            <Link to={createPageUrl('QuotationBuilder')}>
              <Button className="bg-gold hover:bg-[#b8944d] text-white rounded-full">
                <ShoppingCart className="w-4 h-4 mr-2" />
                Quote ({quoteItems.length})
              </Button>
            </Link>
          )}
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="aspect-[4/3] rounded-2xl" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-24" />
              </div>
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <AnimatePresence>
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <ProductCard
                    product={product}
                    onAddToQuote={handleAddToQuote}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto rounded-full bg-stone-100 flex items-center justify-center mb-6">
              <Package className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No products found
            </h3>
            <p className="text-gray-500 mb-6">
              Try adjusting your filters or search query
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setFilters({
                  type: 'all',
                  category: 'all',
                  priceRange: [0, 10000],
                  inStock: false,
                  sort: 'newest',
                });
                setSearchQuery('');
              }}
            >
              Clear all filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;

