// src/Components/products/ProductCard.tsx
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { ShoppingCart } from 'lucide-react';

export interface Product {
  id: string | number;
  name: string;
  description?: string | null;
  category?: string | null;
  type?: string | null;
  price: number;
  in_stock?: boolean;
  image_url?: string | null;
}

interface ProductCardProps {
  product: Product;
  onAddToQuote: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToQuote }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col h-full">
      <div className="aspect-[4/3] w-full overflow-hidden">
        <img
          src={
            product.image_url ||
            'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80'
          }
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-4 flex flex-col gap-3 flex-1">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-semibold text-lg truncate">{product.name}</h3>
          {product.in_stock === false ? (
            <Badge variant="outline" className="border-red-200 text-red-600">
              Out of stock
            </Badge>
          ) : (
            <Badge variant="secondary">In stock</Badge>
          )}
        </div>

        {product.category && (
          <p className="text-sm text-gray-500 capitalize">
            {product.category.replace(/_/g, ' ')}
          </p>
        )}

        <div className="flex items-center justify-between mt-auto">
          <p className="text-xl font-bold text-gold">
            R{product.price.toLocaleString()}
          </p>
          <Button
            size="sm"
            className="bg-gold hover:bg-[#b8944d] text-white rounded-full"
            onClick={() => onAddToQuote(product)}
            disabled={product.in_stock === false}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Add to quote
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

