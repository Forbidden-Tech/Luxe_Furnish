import { Link } from 'react-router-dom';
import { createPageUrl } from '../../utils';
import { Button } from '@/Components/ui/button';
import { ArrowRight, Award, Truck, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80"
          alt="Modern office interior"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-gold text-sm font-medium mb-6">
              Premium Furniture Collection 2024
            </span>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
              Elevate Your
              <span className="block text-gold">Workspace</span>
            </h1>

            <p className="text-lg md:text-xl text-gray-300 mb-10 leading-relaxed">
              Transform your office and home with our curated collection of premium furniture.
              Designed for comfort, built for excellence.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-16">
              <Link to={createPageUrl('Products')}>
                <Button size="lg" className="bg-gold hover:bg-[#b8944d] text-white rounded-full px-8 h-14 text-base">
                  Explore Collection
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to={createPageUrl('QuotationBuilder')}>
                <Button size="lg" variant="outline" className="border-white/30 text-black hover:bg-white/10 rounded-full px-8 h-14 text-base backdrop-blur-sm bg-white/90">
                  Request Quote
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 md:gap-12">
              {[
                { icon: Award, label: '15+ Years', sublabel: 'Experience' },
                { icon: Truck, label: 'Free Delivery', sublabel: 'On orders R5,000+' },
                { icon: Shield, label: '5 Year', sublabel: 'Warranty' },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                    <stat.icon className="w-6 h-6 text-gold" />
                  </div>
                  <div>
                    <p className="text-white font-semibold">{stat.label}</p>
                    <p className="text-gray-400 text-sm">{stat.sublabel}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
          <div className="w-1.5 h-3 bg-gold rounded-full" />
        </div>
      </motion.div>
    </section>
  );
}
