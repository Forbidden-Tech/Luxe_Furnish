import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { createPageUrl } from './utils';
import { Menu, X, Home, Building2, FileText, Info, Phone, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/Components/ui/button';

export default function Layout() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // const [productsDropdown, setProductsDropdown] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', page: 'Home', icon: Home },
    { name: 'Office Furniture', page: 'Products', icon: Building2, params: '?type=office' },
    { name: 'Home Furniture', page: 'Products', icon: Home, params: '?type=home' },
    { name: 'Quotation Builder', page: 'QuotationBuilder', icon: FileText },
    { name: 'About Us', page: 'About', icon: Info },
    { name: 'Contact', page: 'Contact', icon: Phone },
  ];

  return (
    <div className="min-h-screen bg-stone-50">
      <style>{`
        :root {
          --color-primary: #1a1a1a;
          --color-accent: #c9a96e;
          --color-accent-dark: #b8944d;
        }
        .gradient-gold {
          background: linear-gradient(135deg, #c9a96e 0%, #e8d5a3 50%, #c9a96e 100%);
        }
        .text-gold {
          color: #c9a96e;
        }
        .border-gold {
          border-color: #c9a96e;
        }
        .bg-gold {
          background-color: #c9a96e;
        }
        .hover-gold:hover {
          color: #c9a96e;
        }
      `}</style>

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
        }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to={createPageUrl('Home')} className="flex items-center gap-3">
              <div className="w-10 h-10 gradient-gold rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className={`text-xl font-bold tracking-tight ${isScrolled ? 'text-gray-900' : isHomePage ? 'text-white' : 'text-gray-900'
                  }`}>
                  LUXE
                </span>
                <span className="text-gold text-xl font-light">FURNISH</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={createPageUrl(item.page) + (item.params || '')}
                  className={`px-4 py-2 text-sm font-medium transition-all duration-300 rounded-full ${isScrolled
                    ? 'text-black hover:text-gold hover:bg-stone-100'
                    : isHomePage
                      ? 'text-white/90 hover:text-gold hover:bg-white/10'
                      : 'text-black hover:text-gold hover:bg-white/10'
                    }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* CTA Button */}
            <div className="hidden lg:flex items-center gap-4">
              <Link to={createPageUrl('QuotationBuilder')}>
                <Button className="bg-gold hover:bg-[#b8944d] text-white rounded-full px-6">
                  <FileText className="w-4 h-4 mr-2" />
                  Get Quote
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`lg:hidden p-2 rounded-lg ${isScrolled ? 'text-gray-900' : isHomePage ? 'text-white' : 'text-gray-900'
                }`}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-white border-t"
            >
              <div className="px-4 py-6 space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={createPageUrl(item.page) + (item.params || '')}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-stone-100 rounded-xl transition-colors"
                  >
                    <item.icon className="w-5 h-5 text-gold" />
                    {item.name}
                  </Link>
                ))}
                <Link
                  to={createPageUrl('QuotationBuilder')}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block mt-4"
                >
                  <Button className="w-full bg-gold hover:bg-[#b8944d] text-white rounded-full">
                    Get Quote
                  </Button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Main Content */}
      <main><Outlet /></main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 gradient-gold rounded-lg flex items-center justify-center">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="text-xl font-bold">LUXE</span>
                  <span className="text-gold text-xl font-light">FURNISH</span>
                </div>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Premium furniture solutions for modern offices and elegant homes.
                Crafted with excellence since 2010.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider mb-6 text-gold">Quick Links</h4>
              <ul className="space-y-3">
                {['Home', 'Products', 'QuotationBuilder', 'About', 'Contact'].map((page) => (
                  <li key={page}>
                    <Link
                      to={createPageUrl(page)}
                      className="text-gray-400 hover:text-gold transition-colors text-sm"
                    >
                      {page === 'QuotationBuilder' ? 'Quotation Builder' : page}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Categories */}
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider mb-6 text-gold">Categories</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><Link to={createPageUrl('Products') + '?type=office'} className="hover:text-gold transition-colors">Office Furniture</Link></li>
                <li><Link to={createPageUrl('Products') + '?type=home'} className="hover:text-gold transition-colors">Home Furniture</Link></li>
                <li><Link to={createPageUrl('Products') + '?category=office_desk'} className="hover:text-gold transition-colors">Desks</Link></li>
                <li><Link to={createPageUrl('Products') + '?category=office_chair'} className="hover:text-gold transition-colors">Chairs</Link></li>
                <li><Link to={createPageUrl('Products') + '?category=storage'} className="hover:text-gold transition-colors">Storage</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider mb-6 text-gold">Contact</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li>123 Design District</li>
                <li>New York, NY 10001</li>
                <li className="pt-2">contact@luxefurnish.com</li>
                <li>+1 (555) 123-4567</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              © 2024 LuxeFurnish. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-gray-500">
              <a href="#" className="hover:text-gold transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-gold transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

