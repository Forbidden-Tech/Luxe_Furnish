import { Link } from 'react-router-dom';
import { createPageUrl } from '../../utils';
import { motion } from 'framer-motion';
import { ArrowRight, Plus } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';

interface Product {
  id: string | number;
  name: string;
  image_url?: string | null;
  category?: string | null;
  price: number;
  featured?: boolean;
  type?: string | null;
}

interface FeaturedProductsProps {
  products: Product[];
}

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
          <div>
            <span className="text-gold text-sm font-semibold uppercase tracking-wider">
              Our Collection
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mt-3">
              Featured Products
            </h2>
          </div>
          <Link to={createPageUrl('Products')} className="mt-6 md:mt-0">
            <Button
              variant="ghost"
              className="text-gray-600 hover:text-gold group"
            >
              View All Products
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.slice(0, 6).map((product: Product, index: number) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <Link
                to={createPageUrl('ProductDetail') + `?id=${product.id}`}
              >
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-stone-100 mb-5">
                  <img
                    src={
                      product.image_url ||
                      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80'
                    }
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />

                  {/* Quick Add (currently visual only) */}
                  <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                    <Button
                      size="icon"
                      className="bg-white hover:bg-gold hover:text-white rounded-full shadow-lg"
                    >
                      <Plus className="w-5 h-5" />
                    </Button>
                  </div>

                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {product.featured && (
                      <Badge className="bg-gold text-white border-0">
                        Featured
                      </Badge>
                    )}
                    <Badge
                      variant="secondary"
                      className="bg-white/90 text-gray-700"
                    >
                      {product.type === 'office' ? 'Office' : 'Home'}
                    </Badge>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gold font-medium capitalize mb-1">
                    {product.category?.replace(/_/g, ' ')}
                  </p>
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-gold transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-xl font-bold text-gray-900 mt-2">
                    R{product.price?.toLocaleString()}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

