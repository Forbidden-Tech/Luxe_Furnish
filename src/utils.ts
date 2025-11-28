export function createPageUrl(pageName: string): string {
  const pageMap: Record<string, string> = {
    'Home': '/',
    'Products': '/products',
    'ProductDetail': '/product',
    'QuotationBuilder': '/quotation',
    'About': '/about',
    'Contact': '/contact',
  };
  
  return pageMap[pageName] || '/';
}

