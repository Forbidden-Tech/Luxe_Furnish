import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import HeroSection from '../Components/home/HeroSection';
import FeaturedProducts from '../Components/home/FeaturedProducts';
import CategoryShowcase from '../Components/home/CategoryShowcase';
import WhyChooseUs from '../Components/home/WhyChooseUs';
import CTASection from '../Components/home/CTASection';

export default function Home() {
  const { data: products = [] } = useQuery({
    queryKey: ['featured-products'],
    queryFn: () => base44.entities.Product.filter({ featured: true }, '-created_date', 6),
  });

  return (
    <div>
      <HeroSection />
      <FeaturedProducts products={products} />
      <CategoryShowcase />
      <WhyChooseUs />
      <CTASection />
    </div>
  );
}
