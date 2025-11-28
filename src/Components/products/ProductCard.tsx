import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../../utils';
import { Plus, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

export default function ProductCard({ product, onAddToQuote }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group"
    >
      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-stone-100 mb-4">
        <img
          src={product.image_url || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300" />
        
        {/* Actions */}
        <div className="absolute bottom-4 left-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
          <Link to={createPageUrl('ProductDetail') + `?id=${product.id}`} className="flex-1">
            <Button variant="secondary" className="w-full bg-white hover:bg-stone-100 rounded-xl">
              <Eye className="w-4 h-4 mr-2" />
              View Details
            </Button>
          </Link>
          <Button 
            onClick={() => onAddToQuote(product)}
            className="bg-gold hover:bg-[#b8944d] text-white rounded-xl"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {product.featured && (
            <Badge className="bg-gold text-white border-0">Featured</Badge>
          )}
          {!product.in_stock && (
            <Badge variant="destructive">Out of Stock</Badge>
          )}
        </div>
      </div>

      <div>
        <p className="text-sm text-gold font-medium capitalize mb-1">
          {product.category?.replace(/_/g, ' ')}
        </p>
        <Link to={createPageUrl('ProductDetail') + `?id=${product.id}`}>
          <h3 className="text-lg font-semibold text-gray-900 hover:text-gold transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="text-xl font-bold text-gray-900 mt-1">
          R{product.price?.toLocaleString()}
        </p>
      </div>
    </motion.div>
  );
}