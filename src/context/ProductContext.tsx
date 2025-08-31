import { createContext, useState, useContext, useEffect } from 'react';
import type { ReactNode } from 'react';

interface Product {
  id: number;
  name: string;
  processor: string;
  ram: string;
  graphics: string;
  storage: string;
  price: number;
  purpose: string;
  image: string;
  tag?: string;
  specs: string;
  sold_out?: boolean;
  created_at?: string;
  updated_at?: string;
}

interface ProductContextType {
  products: Product[];
  filteredProducts: Product[];
  loading: boolean;
  error: string | null;
  filters: {
    processor: string;
    ram: string;
    graphics: string;
    storage: string;
    purpose: string;
    priceRange: number;
  };
  setFilters: (filters: any) => void;
  resetFilters: () => void;
  convertToTZS: (price: number) => number;
  formatPrice: (price: number) => string;
  fetchProducts: () => Promise<void>;
  searchProducts: (query: string) => Promise<Product[]>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const useProductContext = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProductContext must be used within a ProductProvider');
  }
  return context;
};

interface ProductProviderProps {
  children: ReactNode;
}

export const ProductProvider = ({ children }: ProductProviderProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    processor: '',
    ram: '',
    graphics: '',
    storage: '',
    purpose: '',
    priceRange: 5000
  });

  // API configuration
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/backend/api';

  // Fetch products from API
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching products from:', `${API_BASE_URL}/products.php`);
      
      const response = await fetch(`${API_BASE_URL}/products.php`);
      
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response error text:', errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }
      
      const responseText = await response.text();
      console.log('Raw response:', responseText);
      
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        console.error('Response that failed to parse:', responseText);
        throw new Error(`Failed to parse JSON response: ${parseError instanceof Error ? parseError.message : 'Unknown parse error'}`);
      }
      
      if (data.products && Array.isArray(data.products)) {
        setProducts(data.products);
        setFilteredProducts(data.products);
      } else {
        // Fallback to default products if API fails
        const fallbackProducts = getFallbackProducts();
        setProducts(fallbackProducts);
        setFilteredProducts(fallbackProducts);
        setError('Using sample data - API not available');
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
      
      // Fallback to default products
      const fallbackProducts = getFallbackProducts();
      setProducts(fallbackProducts);
      setFilteredProducts(fallbackProducts);
    } finally {
      setLoading(false);
    }
  };

  // Search products
  const searchProducts = async (query: string): Promise<Product[]> => {
    try {
      console.log('Searching products with query:', query);
      
      const response = await fetch(`${API_BASE_URL}/products.php?search=${encodeURIComponent(query)}`);
      
      console.log('Search response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Search response error text:', errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }
      
      const responseText = await response.text();
      console.log('Search raw response:', responseText);
      
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Search JSON parse error:', parseError);
        console.error('Search response that failed to parse:', responseText);
        throw new Error(`Failed to parse search JSON response: ${parseError instanceof Error ? parseError.message : 'Unknown parse error'}`);
      }
      
      return data.products || [];
    } catch (err) {
      console.error('Error searching products:', err);
      // Fallback to local search
      return products.filter(product => 
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.processor.toLowerCase().includes(query.toLowerCase()) ||
        product.purpose.toLowerCase().includes(query.toLowerCase()) ||
        (product.tag && product.tag.toLowerCase().includes(query.toLowerCase()))
      );
    }
  };

  // Fallback products for when API is not available
  const getFallbackProducts = (): Product[] => [
    {
      id: 1,
      name: 'Gaming Beast Pro',
      processor: 'intel-i7',
      ram: '16gb',
      graphics: 'nvidia-rtx3070',
      storage: 'ssd-1tb',
      price: 1299.99,
      purpose: 'gaming',
      image: '/src/assets/images/pc1.svg',
      tag: 'Best Seller',
      specs: 'Intel Core i7, 16GB DDR4, NVIDIA RTX 3070, 1TB SSD'
    },
    {
      id: 2,
      name: 'Office Master',
      processor: 'intel-i5',
      ram: '8gb',
      graphics: 'integrated',
      storage: 'ssd-512',
      price: 599.99,
      purpose: 'office',
      image: '/src/assets/images/pc2.svg',
      tag: 'Budget',
      specs: 'Intel Core i5, 8GB DDR4, Integrated Graphics, 512GB SSD'
    },
    {
      id: 3,
      name: 'Workstation Elite',
      processor: 'amd-ryzen9',
      ram: '32gb',
      graphics: 'nvidia-rtx3080',
      storage: 'ssd-2tb',
      price: 2199.99,
      purpose: 'workstation',
      image: '/src/assets/images/pc3.svg',
      tag: 'Premium',
      specs: 'AMD Ryzen 9, 32GB DDR4, NVIDIA RTX 3080, 2TB SSD'
    },
    {
      id: 4,
      name: 'Gaming Starter',
      processor: 'amd-ryzen5',
      ram: '8gb',
      graphics: 'nvidia-gtx1660',
      storage: 'combo-ssd-hdd',
      price: 799.99,
      purpose: 'gaming',
      image: '/src/assets/images/pc1.svg',
      tag: 'Entry Level',
      specs: 'AMD Ryzen 5, 8GB DDR4, NVIDIA GTX 1660, 512GB SSD + 2TB HDD'
    }
  ];

  // Function to convert USD to TZS
  const convertToTZS = (price: number): number => {
    const exchangeRate = 2500; // 1 USD = 2500 TZS
    return Math.round(price * exchangeRate);
  };

  // Function to format price with TZS currency
  const formatPrice = (price: number): string => {
    return `TZS ${convertToTZS(price).toLocaleString()}`;
  };

  // Update filtered products when filters change
  const updateFilters = (newFilters: any) => {
    setFilters(newFilters);
    
    // Apply filters
    let filtered = [...products];
    
    if (newFilters.processor) {
      filtered = filtered.filter(pc => pc.processor === newFilters.processor);
    }
    
    if (newFilters.ram) {
      filtered = filtered.filter(pc => pc.ram === newFilters.ram);
    }
    
    if (newFilters.graphics) {
      filtered = filtered.filter(pc => pc.graphics === newFilters.graphics);
    }
    
    if (newFilters.storage) {
      filtered = filtered.filter(pc => pc.storage === newFilters.storage);
    }
    
    if (newFilters.purpose) {
      filtered = filtered.filter(pc => pc.purpose === newFilters.purpose);
    }
    
    // Filter by price range
    filtered = filtered.filter(pc => pc.price <= newFilters.priceRange);
    
    setFilteredProducts(filtered);
  };

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      processor: '',
      ram: '',
      graphics: '',
      storage: '',
      purpose: '',
      priceRange: 5000
    });
    setFilteredProducts(products);
  };

  // Load products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <ProductContext.Provider
      value={{
        products,
        filteredProducts,
        loading,
        error,
        filters,
        setFilters: updateFilters,
        resetFilters,
        convertToTZS,
        formatPrice,
        fetchProducts,
        searchProducts
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};