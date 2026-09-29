import React, { useState } from 'react';
import { X, ShoppingCart, Plus, Minus, Tag, Package, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from './Toast';

const ProductDetailModal = ({ product, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { addToast } = useToast();

  if (!product) return null;

  const handleQuantityChange = (delta) => {
    setQuantity((prev) => {
      const next = prev + delta;
      if (next < 1) return 1;
      if (next > product.stock) return product.stock;
      return next;
    });
  };

  const handleAddToCart = async () => {
    if (product.stock <= 0) {
      addToast('Sorry, this product is out of stock.', 'error');
      return;
    }
    const res = await addToCart(product, quantity);
    if (res.success) {
      addToast(`Added ${quantity} x "${product.name}" to your cart!`, 'success');
      onClose();
    } else {
      addToast(res.message || 'Could not add to cart.', 'error');
    }
  };

  const formattedPrice = typeof product.price === 'number'
    ? product.price.toFixed(2)
    : parseFloat(product.price || 0).toFixed(2);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '800px' }}>
        <button className="modal-close" onClick={onClose}>
          <X size={22} />
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          {/* Image Column */}
          <div style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', background: '#0f172a', border: '1px solid var(--border-glass)' }}>
            <img
              src={product.image_url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80'}
              alt={product.name}
              style={{ width: '100%', height: '340px', objectFit: 'cover' }}
            />
          </div>

          {/* Details Column */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', alignItems: 'center' }}>
                <span className="badge badge-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Tag size={12} />
                  {product.category}
                </span>
                <span className={`badge ${product.stock > 10 ? 'badge-success' : product.stock > 0 ? 'badge-warning' : 'badge-danger'}`}>
                  <Package size={12} style={{ marginRight: '0.2rem' }} />
                  {product.stock > 0 ? `${product.stock} items remaining` : 'Out of stock'}
                </span>
              </div>

              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>{product.name}</h2>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '1rem' }}>
                ${formattedPrice}
              </div>

              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                {product.description || 'Experience peak craftsmanship and unmatched functionality with this curated product.'}
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-emerald)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                <ShieldCheck size={18} />
                <span>Original manufacturer warranty included</span>
              </div>
            </div>

            {/* Quantity and Add To Cart */}
            <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.25rem' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Quantity:</span>
                <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-md)' }}>
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    style={{ background: 'none', border: 'none', color: 'var(--text-main)', padding: '0.5rem 0.75rem', cursor: 'pointer', opacity: quantity <= 1 ? 0.3 : 1 }}
                  >
                    <Minus size={14} />
                  </button>
                  <span style={{ padding: '0 0.75rem', fontWeight: 700, minWidth: '2.5rem', textAlign: 'center' }}>{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= product.stock}
                    style={{ background: 'none', border: 'none', color: 'var(--text-main)', padding: '0.5rem 0.75rem', cursor: 'pointer', opacity: quantity >= product.stock ? 0.3 : 1 }}
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              <button
                className="btn btn-primary"
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                style={{ width: '100%', padding: '0.85rem', fontSize: '1rem', opacity: product.stock <= 0 ? 0.5 : 1 }}
              >
                <ShoppingCart size={18} />
                <span>{product.stock > 0 ? `Add to Cart - $${(parseFloat(formattedPrice) * quantity).toFixed(2)}` : 'Out of Stock'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;
