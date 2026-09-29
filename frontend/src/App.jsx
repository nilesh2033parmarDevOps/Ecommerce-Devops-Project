import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ToastProvider, useToast } from './components/Toast';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/OrdersPage';

import AuthModal from './components/AuthModal';
import AdminProductModal from './components/AdminProductModal';
import { productAPI } from './services/api';

// Fallback demo data in case MySQL server isn't running locally yet
const DEMO_PRODUCTS = [
  {
    id: 1,
    name: 'Aura ANC Wireless Headphones',
    description: 'High-fidelity audio with active noise cancellation, 40-hour battery life, and ultra-soft memory foam earcups.',
    price: 199.99,
    category: 'Electronics',
    image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
    stock: 25
  },
  {
    id: 2,
    name: 'UltraSlim Pro Laptop 15"',
    description: 'Intel Core i7 13th Gen, 16GB RAM, 512GB NVMe SSD, 15.6" Retina display in lightweight magnesium alloy body.',
    price: 1199.00,
    category: 'Electronics',
    image_url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&auto=format&fit=crop&q=80',
    stock: 12
  },
  {
    id: 3,
    name: 'Chronos Minimalist Watch',
    description: 'Japanese quartz movement with sapphire crystal glass and genuine Italian leather strap.',
    price: 149.50,
    category: 'Fashion',
    image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
    stock: 40
  },
  {
    id: 4,
    name: 'Pulse Smart Fitness Tracker',
    description: 'AMOLED color screen, 24/7 heart rate monitoring, sleep tracking, GPS, and 50m water resistance.',
    price: 79.99,
    category: 'Electronics',
    image_url: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=600&auto=format&fit=crop&q=80',
    stock: 30
  },
  {
    id: 5,
    name: 'Urban Explorer Backpack',
    description: 'Waterproof canvas backpack with padded 16" laptop sleeve, anti-theft hidden pocket, and USB charging port.',
    price: 64.95,
    category: 'Accessories',
    image_url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80',
    stock: 50
  },
  {
    id: 6,
    name: 'Artisan Pour-Over Coffee Maker',
    description: 'Heat-resistant borosilicate glass carafe with permanent stainless steel mesh filter.',
    price: 34.99,
    category: 'Home & Kitchen',
    image_url: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=600&auto=format&fit=crop&q=80',
    stock: 18
  },
  {
    id: 7,
    name: 'ErgoFlex Ergonomic Desk Chair',
    description: 'Breathable mesh backrest, adjustable lumbar support, 3D armrests, and dynamic recline tilt.',
    price: 249.00,
    category: 'Furniture',
    image_url: 'https://images.unsplash.com/photo-1580481072645-022f9a6d8310?w=600&auto=format&fit=crop&q=80',
    stock: 15
  },
  {
    id: 8,
    name: 'AeroBass Mini Bluetooth Speaker',
    description: 'Portable 360-degree surround sound speaker with IPX7 waterproof rating and 12-hour continuous playback.',
    price: 49.99,
    category: 'Electronics',
    image_url: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&auto=format&fit=crop&q=80',
    stock: 60
  }
];

const MainApp = () => {
  const [activePage, setActivePage] = useState('home');
  const [products, setProducts] = useState(DEMO_PRODUCTS);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Modals state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedCategory !== 'All') params.category = selectedCategory;
      const res = await productAPI.getAll(params);
      if (res.data.success && res.data.products.length > 0) {
        setProducts(res.data.products);
      }
    } catch (err) {
      console.warn('API connection offline or pending MySQL start. Displaying fallback dataset.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <Navbar
        activePage={activePage}
        setActivePage={setActivePage}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenAdminModal={() => setIsAdminModalOpen(true)}
      />

      <main className="main-content">
        {activePage === 'home' && (
          <HomePage
            products={products}
            loading={loading}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            searchQuery={searchQuery}
            selectedProduct={selectedProduct}
            setSelectedProduct={setSelectedProduct}
          />
        )}

        {activePage === 'cart' && (
          <CartPage
            onNavigate={setActivePage}
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
          />
        )}

        {activePage === 'checkout' && (
          <CheckoutPage
            onNavigate={setActivePage}
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
          />
        )}

        {activePage === 'orders' && (
          <OrdersPage
            onNavigate={setActivePage}
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
          />
        )}
      </main>

      <Footer />

      {/* Global Modals */}
      {isAuthModalOpen && (
        <AuthModal onClose={() => setIsAuthModalOpen(false)} />
      )}

      {isAdminModalOpen && (
        <AdminProductModal
          products={products}
          onClose={() => setIsAdminModalOpen(false)}
          onRefreshProducts={fetchProducts}
        />
      )}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <ToastProvider>
          <MainApp />
        </ToastProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
