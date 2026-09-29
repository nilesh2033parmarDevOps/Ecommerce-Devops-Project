import React, { useState } from 'react';
import ProductCard from '../components/ProductCard';
import ProductDetailModal from '../components/ProductDetailModal';
import { Sparkles, SlidersHorizontal, PackageX } from 'lucide-react';

const CATEGORIES = ['All', 'Electronics', 'Fashion', 'Accessories', 'Home & Kitchen', 'Furniture'];

const HomePage = ({ products, loading, selectedCategory, setSelectedCategory, searchQuery, onSelectProduct, selectedProduct, setSelectedProduct }) => {
  const [sortBy, setSortBy] = useState('newest');

  // Filter products by category and search query
  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') return parseFloat(a.price) - parseFloat(b.price);
    if (sortBy === 'price-high') return parseFloat(b.price) - parseFloat(a.price);
    return new Date(b.created_at || 0) - new Date(a.created_at || 0);
  });

  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'var(--primary-light)', padding: '0.4rem 0.9rem', borderRadius: 'var(--radius-full)', color: '#a5b4fc', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1rem' }}>
          <Sparkles size={16} />
          <span>Next-Gen E-Commerce Showcase</span>
        </div>
        <h1>Discover Future-Ready Technology & Lifestyle</h1>
        <p>Explore our premium collection of audio gear, smart electronics, fashion accessories, and home essentials.</p>
      </section>

      {/* Categories & Filter Bar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.5rem' }}>
        <div className="category-bar" style={{ marginBottom: 0 }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`category-chip ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sort selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-card)', padding: '0.4rem 0.8rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)' }}>
          <SlidersHorizontal size={14} style={{ color: 'var(--text-muted)' }} />
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{ background: 'none', border: 'none', color: 'var(--text-main)', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', outline: 'none' }}
          >
            <option value="newest" style={{ background: 'var(--bg-card)' }}>Newest Arrivals</option>
            <option value="price-low" style={{ background: 'var(--bg-card)' }}>Price: Low to High</option>
            <option value="price-high" style={{ background: 'var(--bg-card)' }}>Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Product List Grid */}
      {loading ? (
        <div style={{ textAlignment: 'center', padding: '4rem 0', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem', color: 'var(--text-secondary)' }}>
          <div style={{ width: '24px', height: '24px', border: '3px solid var(--primary-light)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
          <span>Loading products from REST API...</span>
        </div>
      ) : sortedProducts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 1.5rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-glass)' }}>
          <PackageX size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>No products found</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Try changing your category filter or search terms.</p>
        </div>
      ) : (
        <div className="product-grid">
          {sortedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelectProduct={(p) => setSelectedProduct(p)}
            />
          ))}
        </div>
      )}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
};

export default HomePage;
