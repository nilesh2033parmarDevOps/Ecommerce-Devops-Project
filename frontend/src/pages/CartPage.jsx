import React from 'react';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, ArrowLeft, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

const CartPage = ({ onNavigate, onOpenAuthModal }) => {
  const { cart, updateQuantity, removeFromCart } = useCart();

  const subtotal = typeof cart.subtotal === 'number' ? cart.subtotal : parseFloat(cart.subtotal || 0);
  const shipping = subtotal > 50 || subtotal === 0 ? 0 : 9.99;
  const total = subtotal + shipping;

  if (cart.items.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 1.5rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-glass)' }}>
        <ShoppingBag size={56} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>Your Cart is Empty</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Looks like you haven't added any products to your cart yet.</p>
        <button className="btn btn-primary" onClick={() => onNavigate('home')}>
          <ArrowLeft size={16} />
          <span>Explore Products</span>
        </button>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
        <ShoppingCart size={28} style={{ color: 'var(--primary)' }} />
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Shopping Cart ({cart.items.length} items)</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        {/* Cart Items List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {cart.items.map((item) => (
            <div
              key={item.itemId}
              className="card"
              style={{ padding: '1.25rem', display: 'flex', gap: '1.25rem', alignItems: 'center' }}
            >
              <img
                src={item.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&auto=format&fit=crop&q=80'}
                alt={item.name}
                style={{ width: '85px', height: '85px', objectFit: 'cover', borderRadius: 'var(--radius-md)' }}
              />

              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.25rem' }}>{item.name}</h3>
                <span className="badge badge-primary" style={{ fontSize: '0.7rem', marginBottom: '0.5rem' }}>{item.category}</span>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: '#fff' }}>
                  ${parseFloat(item.price).toFixed(2)}
                </div>
              </div>

              {/* Quantity Controls */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-md)' }}>
                  <button
                    onClick={() => updateQuantity(item.itemId, item.quantity - 1)}
                    style={{ background: 'none', border: 'none', color: 'var(--text-main)', padding: '0.4rem 0.6rem', cursor: 'pointer' }}
                  >
                    <Minus size={14} />
                  </button>
                  <span style={{ padding: '0 0.5rem', fontWeight: 700, minWidth: '2rem', textAlign: 'center', fontSize: '0.9rem' }}>
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.itemId, item.quantity + 1)}
                    style={{ background: 'none', border: 'none', color: 'var(--text-main)', padding: '0.4rem 0.6rem', cursor: 'pointer' }}
                  >
                    <Plus size={14} />
                  </button>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--primary)' }}>
                    ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                  </span>
                  <button
                    onClick={() => removeFromCart(item.itemId)}
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                    title="Remove Item"
                  >
                    <Trash2 size={16} style={{ color: 'var(--accent-rose)' }} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary Sidebar */}
        <div>
          <div className="card" style={{ padding: '1.75rem', position: 'sticky', top: '90px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.75rem' }}>
              Order Summary
            </h2>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', color: 'var(--text-secondary)' }}>
              <span>Subtotal</span>
              <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>${subtotal.toFixed(2)}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem', color: 'var(--text-secondary)' }}>
              <span>Estimated Shipping</span>
              <span style={{ fontWeight: 600, color: shipping === 0 ? 'var(--accent-emerald)' : 'var(--text-main)' }}>
                {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-glass)', paddingTop: '1rem', marginBottom: '1.5rem', fontSize: '1.2rem', fontWeight: 800 }}>
              <span>Total</span>
              <span style={{ color: 'var(--primary)' }}>${total.toFixed(2)}</span>
            </div>

            <button
              className="btn btn-primary"
              onClick={() => onNavigate('checkout')}
              style={{ width: '100%', padding: '0.85rem', fontSize: '1rem' }}
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
