import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../../utils';
import { Button } from '@/components/ui/button';
import { ArrowRight, Phone, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CTASection() {
  return (
    <section className="py-24 bg-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden"
        >
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=80"
              alt="Interior design"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900/95 via-gray-900/80 to-gray-900/60" />
          </div>

          <div className="relative px-8 py-16 md:px-16 md:py-24">
            <div className="max-w-2xl">
              <span className="text-gold text-sm font-semibold uppercase tracking-wider">Get Started</span>
              <h2 className="text-3xl md:text-5xl font-bold text-white mt-4 mb-6">
                Ready to Transform Your Space?
              </h2>
              <p className="text-lg text-gray-300 mb-10 leading-relaxed">
                Let our experts help you create the perfect environment. Get a customized quotation 
                tailored to your needs and budget.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Link to={createPageUrl('QuotationBuilder')}>
                  <Button size="lg" className="bg-gold hover:bg-[#b8944d] text-white rounded-full px-8 h-14">
                    Build Your Quote
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link to={createPageUrl('Contact')}>
                  <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 rounded-full px-8 h-14">
                    Contact Us
                  </Button>
                </Link>
              </div>

              <div className="flex flex-col sm:flex-row gap-6 text-gray-300">
                <a href="tel:+15551234567" className="flex items-center gap-3 hover:text-gold transition-colors">
                  <Phone className="w-5 h-5" />
                  +1 (555) 123-4567
                </a>
                <a href="mailto:contact@luxefurnish.com" className="flex items-center gap-3 hover:text-gold transition-colors">
                  <Mail className="w-5 h-5" />
                  contact@luxefurnish.com
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}