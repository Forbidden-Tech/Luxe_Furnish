import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../../utils';
import { motion } from 'framer-motion';
import { ArrowUpRight, Building2, Home } from 'lucide-react';

const categories = [
  {
    title: 'Office Furniture',
    description: 'Professional solutions for productive workspaces',
    image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&q=80',
    type: 'office',
    icon: Building2,
    count: 'Collection'
  },
  {
    title: 'Home Furniture',
    description: 'Elegant pieces for comfortable living',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80',
    type: 'home',
    icon: Home,
    count: 'Collection'
  }
];

export default function CategoryShowcase() {
  return (
    <section className="py-24 bg-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-gold text-sm font-semibold uppercase tracking-wider">Categories</span>
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mt-3">Shop by Collection</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {categories.map((category, index) => (
            <motion.div
              key={category.type}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Link to={createPageUrl('Products') + `?type=${category.type}`}>
                <div className="relative h-[400px] md:h-[500px] rounded-3xl overflow-hidden group">
                  <img
                    src={category.image}
                    alt={category.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  <div className="absolute inset-0 p-8 flex flex-col justify-end">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-gold/20 backdrop-blur-sm flex items-center justify-center">
                        <category.icon className="w-6 h-6 text-gold" />
                      </div>
                      <span className="text-gold text-sm font-medium">{category.count}</span>
                    </div>
                    <h3 className="text-3xl md:text-4xl font-bold text-white mb-2">{category.title}</h3>
                    <p className="text-gray-300 mb-6">{category.description}</p>
                    
                    <div className="flex items-center gap-2 text-white group-hover:text-gold transition-colors">
                      <span className="font-medium">Explore Collection</span>
                      <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}