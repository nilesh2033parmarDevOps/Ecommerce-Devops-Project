import React from 'react';
import { ShoppingCart, Eye } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from './Toast';

const ProductCard = ({ product, onSelectProduct }) => {
  const { addToCart } = useCart();
  const { addToast } = useToast();

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    if (product.stock <= 0) {
      addToast('Sorry, this product is currently out of stock.', 'error');
      return;
    }
    const res = await addToCart(product, 1);
    if (res.success) {
      addToast(`Added "${product.name}" to cart!`, 'success');
    } else {
      addToast(res.message || 'Could not add to cart.', 'error');
    }
  };

  const formattedPrice = typeof product.price === 'number' 
    ? product.price.toFixed(2) 
    : parseFloat(product.price || 0).toFixed(2);

  return (
    <div className="card" onClick={() => onSelectProduct(product)} style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column' }}>
      {/* Product Image Container */}
      <div style={{ position: 'relative', width: '100%', paddingTop: '65%', overflow: 'hidden', background: '#0f172a' }}>
        <img
          src={product.image_url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80'}
          alt={product.name}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.4s ease'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.06)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1.0)')}
        />
        {/* Category Badge */}
        <span
          className="badge badge-primary"
          style={{ position: 'absolute', top: '0.75rem', left: '0.75rem', backdropFilter: 'blur(8px)' }}
        >
          {product.category}
        </span>

        {/* Stock Badge */}
        <span
          className={`badge ${product.stock > 10 ? 'badge-success' : product.stock > 0 ? 'badge-warning' : 'badge-danger'}`}
          style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', backdropFilter: 'blur(8px)' }}
        >
          {product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock'}
        </span>
      </div>

      {/* Card Content */}
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-main)' }}>
            {product.name}
          </h3>
          <p
            style={{
              fontSize: '0.85rem',
              color: 'var(--text-secondary)',
              marginBottom: '1rem',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
          >
            {product.description || 'Premium quality product available for instant dispatch.'}
          </p>
        </div>

        {/* Bottom price and action */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px solid var(--border-glass)' }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Price</span>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>${formattedPrice}</span>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              className="btn btn-secondary"
              onClick={(e) => { e.stopPropagation(); onSelectProduct(product); }}
              title="Quick View Details"
              style={{ padding: '0.5rem 0.75rem' }}
            >
              <Eye size={16} />
            </button>
            <button
              className="btn btn-primary"
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
              style={{ opacity: product.stock <= 0 ? 0.5 : 1, padding: '0.5rem 0.9rem', fontSize: '0.85rem' }}
            >
              <ShoppingCart size={15} />
              <span>Add</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
