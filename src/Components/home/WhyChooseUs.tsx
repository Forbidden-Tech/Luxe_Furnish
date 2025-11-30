import { motion } from 'framer-motion';
import { Sparkles, Shield, Truck, Headphones, Award, Leaf } from 'lucide-react';

const features = [
  {
    icon: Sparkles,
    title: 'Premium Quality',
    description: 'Handcrafted furniture using the finest materials and expert craftsmanship'
  },
  {
    icon: Shield,
    title: '5-Year Warranty',
    description: 'Complete peace of mind with our comprehensive warranty coverage'
  },
  {
    icon: Truck,
    title: 'White Glove Delivery',
    description: 'Professional delivery and setup service right to your doorstep'
  },
  {
    icon: Headphones,
    title: 'Expert Support',
    description: 'Dedicated design consultants to help you make the perfect choice'
  },
  {
    icon: Award,
    title: 'Award Winning',
    description: 'Recognized for excellence in design and customer satisfaction'
  },
  {
    icon: Leaf,
    title: 'Sustainable',
    description: 'Eco-friendly materials and responsible manufacturing practices'
  }
];

export default function WhyChooseUs() {
  return (
    <section className="py-24 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-gold text-sm font-semibold uppercase tracking-wider">Why Choose Us</span>
          <h2 className="text-3xl md:text-5xl font-bold text-white mt-3">The LuxeFurnish Difference</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group"
            >
              <div className="w-14 h-14 rounded-xl bg-gold/20 flex items-center justify-center mb-6 group-hover:bg-gold/30 transition-colors">
                <feature.icon className="w-7 h-7 text-gold" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
