// Base44 API Client with localStorage-based data store
// This provides a working implementation using localStorage for persistence

interface Base44Entity {
  list: (sort?: string, limit?: number) => Promise<any[]>;
  filter: (filters: Record<string, any>, sort?: string, limit?: number) => Promise<any[]>;
  create: (data: any) => Promise<any>;
  update: (id: string, data: any) => Promise<any>;
  delete: (id: string) => Promise<any>;
}

// Sample products data
const sampleProducts = [
  {
    id: '1',
    name: 'Executive Office Desk',
    category: 'office_desk',
    type: 'office',
    price: 2500,
    description: 'Premium executive desk with built-in storage and cable management.',
    dimensions: '180cm x 80cm x 75cm',
    materials: 'Solid oak wood, steel frame',
    colors: ['Oak', 'Walnut', 'Black'],
    image_url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80',
    in_stock: true,
    featured: true,
    created_date: new Date('2024-01-15').toISOString(),
  },
  {
    id: '2',
    name: 'Ergonomic Office Chair',
    category: 'office_chair',
    type: 'office',
    price: 850,
    description: 'Comfortable ergonomic chair with lumbar support and adjustable height.',
    dimensions: '65cm x 65cm x 120cm',
    materials: 'Mesh back, leather seat, aluminum base',
    colors: ['Black', 'Gray', 'Blue'],
    image_url: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=800&q=80',
    in_stock: true,
    featured: true,
    created_date: new Date('2024-01-20').toISOString(),
  },
  {
    id: '3',
    name: 'Modern Conference Table',
    category: 'conference_table',
    type: 'office',
    price: 4500,
    description: 'Large conference table perfect for boardrooms and meeting spaces.',
    dimensions: '300cm x 120cm x 75cm',
    materials: 'Glass top, steel legs',
    colors: ['Clear Glass', 'Tinted Glass'],
    image_url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
    in_stock: true,
    featured: true,
    created_date: new Date('2024-02-01').toISOString(),
  },
  {
    id: '4',
    name: 'Storage Cabinet',
    category: 'storage',
    type: 'office',
    price: 1200,
    description: 'Spacious filing cabinet with multiple drawers and lock mechanism.',
    dimensions: '90cm x 45cm x 120cm',
    materials: 'Steel construction',
    colors: ['White', 'Black', 'Gray'],
    image_url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80',
    in_stock: true,
    featured: false,
    created_date: new Date('2024-02-10').toISOString(),
  },
  {
    id: '5',
    name: 'Luxury Sofa Set',
    category: 'home_sofa',
    type: 'home',
    price: 5500,
    description: 'Elegant 3-seater sofa with matching armchairs, perfect for living rooms.',
    dimensions: '240cm x 95cm x 85cm',
    materials: 'Premium fabric, hardwood frame',
    colors: ['Beige', 'Gray', 'Navy'],
    image_url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80',
    in_stock: true,
    featured: true,
    created_date: new Date('2024-02-15').toISOString(),
  },
  {
    id: '6',
    name: 'Dining Table Set',
    category: 'home_table',
    type: 'home',
    price: 3200,
    description: 'Beautiful dining table with 6 matching chairs.',
    dimensions: '200cm x 100cm x 75cm',
    materials: 'Solid wood, upholstered seats',
    colors: ['Oak', 'Walnut'],
    image_url: 'https://images.unsplash.com/photo-1581539250439-c96689b516dd?w=800&q=80',
    in_stock: true,
    featured: true,
    created_date: new Date('2024-02-20').toISOString(),
  },
  {
    id: '7',
    name: 'Comfortable Armchair',
    category: 'home_chair',
    type: 'home',
    price: 950,
    description: 'Plush armchair with ottoman, ideal for reading nooks.',
    dimensions: '85cm x 90cm x 100cm',
    materials: 'Leather, foam padding',
    colors: ['Brown', 'Black', 'Cream'],
    image_url: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800&q=80',
    in_stock: true,
    featured: false,
    created_date: new Date('2024-03-01').toISOString(),
  },
  {
    id: '8',
    name: 'King Size Bed Frame',
    category: 'home_bed',
    type: 'home',
    price: 2800,
    description: 'Elegant king-size bed frame with headboard and storage drawers.',
    dimensions: '200cm x 200cm x 110cm',
    materials: 'Solid wood, fabric headboard',
    colors: ['Oak', 'Walnut', 'White'],
    image_url: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&q=80',
    in_stock: true,
    featured: false,
    created_date: new Date('2024-03-05').toISOString(),
  },
  {
    id: '9',
    name: 'Desk Lamp',
    category: 'accessories',
    type: 'office',
    price: 150,
    description: 'Modern LED desk lamp with adjustable brightness and color temperature.',
    dimensions: '35cm x 20cm x 45cm',
    materials: 'Aluminum, LED',
    colors: ['Silver', 'Black', 'White'],
    image_url: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80',
    in_stock: true,
    featured: false,
    created_date: new Date('2024-03-10').toISOString(),
  },
  {
    id: '10',
    name: 'Standing Desk',
    category: 'office_desk',
    type: 'office',
    price: 1800,
    description: 'Electric height-adjustable standing desk for modern workspaces.',
    dimensions: '160cm x 80cm x 75-125cm',
    materials: 'Bamboo top, steel frame',
    colors: ['Natural Bamboo', 'Dark Bamboo'],
    image_url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80',
    in_stock: true,
    featured: false,
    created_date: new Date('2024-03-15').toISOString(),
  },
];

// Initialize localStorage with sample data if empty
function initializeStorage() {
  const existingProducts = localStorage.getItem('base44_products');
  if (!existingProducts) {
    localStorage.setItem('base44_products', JSON.stringify(sampleProducts));
  } else {
    // Update product images if they exist with old URLs
    try {
      const products = JSON.parse(existingProducts);
      let updated = false;
      
      // Update Ergonomic Office Chair (id: '2')
      const chairIndex = products.findIndex((p: any) => p.id === '2' && p.name === 'Ergonomic Office Chair');
      if (chairIndex !== -1) {
        const oldUrls = [
          'https://images.unsplash.com/photo-1506439773649-6d5f9a3706f1?w=800&q=80',
          'https://images.unsplash.com/photo-1592128546260-5e1d8280b08b?w=800&q=80'
        ];
        if (oldUrls.includes(products[chairIndex].image_url)) {
          products[chairIndex].image_url = 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=800&q=80';
          updated = true;
        }
      }
      
      // Update King Size Bed Frame (id: '8')
      const bedIndex = products.findIndex((p: any) => p.id === '8' && p.name === 'King Size Bed Frame');
      if (bedIndex !== -1) {
        const oldUrl = 'https://images.unsplash.com/photo-1631889992176-7863bd170c0c?w=800&q=80';
        if (products[bedIndex].image_url === oldUrl) {
          products[bedIndex].image_url = 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&q=80';
          updated = true;
        }
      }
      
      if (updated) {
        localStorage.setItem('base44_products', JSON.stringify(products));
      }
    } catch (e) {
      // If parsing fails, reset with sample data
      localStorage.setItem('base44_products', JSON.stringify(sampleProducts));
    }
  }
  if (!localStorage.getItem('base44_contact_inquiries')) {
    localStorage.setItem('base44_contact_inquiries', JSON.stringify([]));
  }
  if (!localStorage.getItem('base44_quotations')) {
    localStorage.setItem('base44_quotations', JSON.stringify([]));
  }
}

// Helper function to sort data
function sortData(data: any[], sort?: string): any[] {
  if (!sort) return data;
  
  const [field, direction] = sort.startsWith('-') 
    ? [sort.slice(1), 'desc'] 
    : [sort, 'asc'];
  
  return [...data].sort((a, b) => {
    let aVal = a[field];
    let bVal = b[field];
    
    // Handle date strings
    if (field.includes('date') || field === 'created_date') {
      aVal = new Date(aVal).getTime();
      bVal = new Date(bVal).getTime();
    }
    
    // Handle numbers
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return direction === 'asc' ? aVal - bVal : bVal - aVal;
    }
    
    // Handle strings
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return direction === 'asc' 
        ? aVal.localeCompare(bVal) 
        : bVal.localeCompare(aVal);
    }
    
    return 0;
  });
}

// Helper function to filter data
function filterData(data: any[], filters: Record<string, any>): any[] {
  return data.filter(item => {
    return Object.entries(filters).every(([key, value]) => {
      if (value === undefined || value === null || value === '') return true;
      
      // Handle boolean filters
      if (typeof value === 'boolean') {
        return item[key] === value;
      }
      
      // Handle exact match
      if (item[key] === value) return true;
      
      // Handle array contains
      if (Array.isArray(item[key])) {
        return item[key].includes(value);
      }
      
      // Handle string contains (case insensitive)
      if (typeof item[key] === 'string' && typeof value === 'string') {
        return item[key].toLowerCase().includes(value.toLowerCase());
      }
      
      return false;
    });
  });
}

class Base44Client {
  constructor() {
    initializeStorage();
  }

  private getStorageKey(entity: string): string {
    return `base44_${entity.toLowerCase()}`;
  }

  private getData(entity: string): any[] {
    const key = this.getStorageKey(entity);
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }

  private setData(entity: string, data: any[]): void {
    const key = this.getStorageKey(entity);
    localStorage.setItem(key, JSON.stringify(data));
  }

  entities = {
    Product: {
      list: async (sort?: string, limit?: number): Promise<any[]> => {
        let data = this.getData('products');
        data = sortData(data, sort);
        if (limit) data = data.slice(0, limit);
        return data;
      },
      
      filter: async (
        filters: Record<string, any>, 
        sort?: string, 
        limit?: number
      ): Promise<any[]> => {
        let data = this.getData('products');
        data = filterData(data, filters);
        data = sortData(data, sort);
        if (limit) data = data.slice(0, limit);
        return data;
      },
      
      create: async (data: any): Promise<any> => {
        const products = this.getData('products');
        const newProduct = {
          ...data,
          id: Date.now().toString(),
          created_date: new Date().toISOString(),
        };
        products.push(newProduct);
        this.setData('products', products);
        return newProduct;
      },
      
      update: async (id: string, data: any): Promise<any> => {
        const products = this.getData('products');
        const index = products.findIndex((p: any) => p.id === id);
        if (index === -1) throw new Error('Product not found');
        products[index] = { ...products[index], ...data };
        this.setData('products', products);
        return products[index];
      },
      
      delete: async (id: string): Promise<void> => {
        const products = this.getData('products');
        const filtered = products.filter((p: any) => p.id !== id);
        this.setData('products', filtered);
      },
    } as Base44Entity,
    
    ContactInquiry: {
      create: async (data: any): Promise<any> => {
        const inquiries = this.getData('contact_inquiries');
        const newInquiry = {
          ...data,
          id: Date.now().toString(),
          status: 'new',
          created_date: new Date().toISOString(),
        };
        inquiries.push(newInquiry);
        this.setData('contact_inquiries', inquiries);
        return newInquiry;
      },
      
      list: async (): Promise<any[]> => {
        return this.getData('contact_inquiries');
      },
    } as Base44Entity,
    
    Quotation: {
      create: async (data: any): Promise<any> => {
        const quotations = this.getData('quotations');
        const newQuotation = {
          ...data,
          id: Date.now().toString(),
          created_date: new Date().toISOString(),
        };
        quotations.push(newQuotation);
        this.setData('quotations', quotations);
        return newQuotation;
      },
      
      list: async (): Promise<any[]> => {
        return this.getData('quotations');
      },
    } as Base44Entity,
  };
}

export const base44 = new Base44Client();
