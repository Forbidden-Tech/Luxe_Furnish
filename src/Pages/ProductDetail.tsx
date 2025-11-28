import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { 
  ArrowLeft, 
  Plus, 
  Minus, 
  ShoppingCart, 
  Check, 
  Truck, 
  Shield, 
  RotateCcw,
  ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProductDetail() {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');
  const [quantity, setQuantity] = useState(1);

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => base44.entities.Product.filter({ id: productId }),
    select: (data) => data[0],
    enabled: !!productId
  });

  const { data: relatedProducts = [] } = useQuery({
    queryKey: ['related-products', product?.category],
    queryFn: () => base44.entities.Product.filter({ category: product.category }, '-created_date', 4),
    enabled: !!product?.category
  });

  const handleAddToQuote = () => {
    const existingItems = JSON.parse(localStorage.getItem('quoteItems') || '[]');
    const existingIndex = existingItems.findIndex(item => item.product_id === product.id);
    
    if (existingIndex >= 0) {
      existingItems[existingIndex].quantity += quantity;
      existingItems[existingIndex].total = existingItems[existingIndex].quantity * existingItems[existingIndex].unit_price;
    } else {
      existingItems.push({
        product_id: product.id,
        product_name: product.name,
        quantity: quantity,
        unit_price: product.price,
        total: product.price * quantity
      });
    }

    localStorage.setItem('quoteItems', JSON.stringify(existingItems));
    toast.success('Added to quote builder');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-stone-50 pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid lg:grid-cols-2 gap-12">
            <Skeleton className="aspect-square rounded-3xl" />
            <div className="space-y-6">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-2/3" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-stone-50 pt-24 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h2>
          <Link to={createPageUrl('Products')}>
            <Button>Back to Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link to={createPageUrl('Home')} className="hover:text-gold">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <Link to={createPageUrl('Products')} className="hover:text-gold">Products</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative"
          >
            <div className="aspect-square rounded-3xl overflow-hidden bg-white">
              <img
                src={product.image_url || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&q=80'}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {product.featured && (
              <Badge className="absolute top-6 left-6 bg-gold text-white border-0 text-sm px-4 py-1">
                Featured
              </Badge>
            )}
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <p className="text-gold font-medium capitalize mb-2">
                {product.category?.replace(/_/g, ' ')} • {product.type}
              </p>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{product.name}</h1>
            </div>

            <p className="text-gray-600 text-lg leading-relaxed">
              {product.description || 'Premium quality furniture designed for comfort and style.'}
            </p>

            <div className="text-4xl font-bold text-gray-900">
              R{product.price?.toLocaleString()}
            </div>

            {/* Specifications */}
            {(product.dimensions || product.materials) && (
              <div className="grid grid-cols-2 gap-4 py-6 border-y border-gray-200">
                {product.dimensions && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Dimensions</p>
                    <p className="font-medium">{product.dimensions}</p>
                  </div>
                )}
                {product.materials && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Materials</p>
                    <p className="font-medium">{product.materials}</p>
                  </div>
                )}
              </div>
            )}

            {/* Colors */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <p className="text-sm text-gray-500 mb-3">Available Colors</p>
                <div className="flex gap-2">
                  {product.colors.map((color, index) => (
                    <Badge key={index} variant="secondary" className="capitalize">
                      {color}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity & Add to Quote */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500">Quantity</span>
                <div className="flex items-center border rounded-xl">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="rounded-l-xl"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                    className="rounded-r-xl"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <Button 
                onClick={handleAddToQuote}
                className="flex-1 bg-gold hover:bg-[#b8944d] text-white h-12 rounded-xl text-base"
                disabled={!product.in_stock}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add to Quote
              </Button>
            </div>

            {/* Stock Status */}
            <div className={`flex items-center gap-2 ${product.in_stock !== false ? 'text-green-600' : 'text-red-500'}`}>
              <Check className="w-5 h-5" />
              <span className="font-medium">
                {product.in_stock !== false ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
              {[
                { icon: Truck, label: 'Free Shipping', sublabel: 'On orders R5,000+' },
                { icon: Shield, label: '5-Year Warranty', sublabel: 'Full coverage' },
                { icon: RotateCcw, label: 'Easy Returns', sublabel: '30-day policy' },
              ].map((feature) => (
                <div key={feature.label} className="flex items-center gap-3 p-4 bg-white rounded-xl">
                  <feature.icon className="w-6 h-6 text-gold" />
                  <div>
                    <p className="font-medium text-sm">{feature.label}</p>
                    <p className="text-xs text-gray-500">{feature.sublabel}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 1 && (
          <div className="mt-24">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Products</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.filter(p => p.id !== product.id).slice(0, 4).map((related) => (
                <Link key={related.id} to={createPageUrl('ProductDetail') + `?id=${related.id}`}>
                  <div className="group">
                    <div className="aspect-[4/3] rounded-xl overflow-hidden bg-white mb-3">
                      <img
                        src={related.image_url || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80'}
                        alt={related.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <h3 className="font-medium text-gray-900 group-hover:text-gold transition-colors">
                      {related.name}
                    </h3>
                    <p className="font-bold">R{related.price?.toLocaleString()}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}