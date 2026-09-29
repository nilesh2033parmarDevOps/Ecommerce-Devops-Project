import React, { useState } from 'react';
import { ShieldCheck, CreditCard, Truck, CheckCircle2, ArrowRight, User } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderAPI } from '../services/api';
import { useToast } from '../components/Toast';

const CheckoutPage = ({ onNavigate, onOpenAuthModal }) => {
  const { cart, clearCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const { addToast } = useToast();

  const [loading, setLoading] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);

  const [formData, setFormData] = useState({
    shippingName: user?.name || '',
    address: '123 Innovation Drive, Suite 400',
    city: 'San Francisco',
    postalCode: '94103',
    country: 'United States',
    paymentMethod: 'card'
  });

  const subtotal = typeof cart.subtotal === 'number' ? cart.subtotal : parseFloat(cart.subtotal || 0);
  const shipping = subtotal > 50 || subtotal === 0 ? 0 : 9.99;
  const total = subtotal + shipping;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      addToast('Please login or register to place your order.', 'info');
      onOpenAuthModal();
      return;
    }

    if (cart.items.length === 0) {
      addToast('Your cart is empty.', 'error');
      return;
    }

    setLoading(true);

    try {
      // Call REST API POST /api/orders
      const res = await orderAPI.createOrder();
      if (res.data.success) {
        setCompletedOrder(res.data.order);
        clearCart();
        addToast('Order placed successfully!', 'success');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to place order. Please try again.';
      addToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  if (completedOrder) {
    return (
      <div style={{ maxWidth: '650px', margin: '2rem auto', textAlign: 'center' }}>
        <div className="card" style={{ padding: '3rem 2rem' }}>
          <div style={{ width: '64px', height: '64px', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-emerald)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
            <CheckCircle2 size={36} />
          </div>

          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.5rem' }}>Order Confirmed!</h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            Thank you for your purchase. Your order <strong style={{ color: 'var(--primary)' }}>#{completedOrder.id}</strong> has been received and is being processed.
          </p>

          <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-md)', padding: '1.25rem', textAlign: 'left', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Order ID:</span>
              <span style={{ fontWeight: 700 }}>#{completedOrder.id}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Status:</span>
              <span className="badge badge-warning">{completedOrder.status}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Total Amount:</span>
              <span style={{ fontWeight: 800, color: 'var(--accent-emerald)' }}>${parseFloat(completedOrder.total_amount).toFixed(2)}</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button className="btn btn-secondary" onClick={() => onNavigate('orders')}>
              View Order History
            </button>
            <button className="btn btn-primary" onClick={() => onNavigate('home')}>
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '2rem' }}>Checkout</h1>

      <form onSubmit={handlePlaceOrder}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          {/* Form section */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Shipping Address */}
            <div className="card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.75rem' }}>
                <Truck size={20} style={{ color: 'var(--primary)' }} />
                <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>1. Shipping Details</h2>
              </div>

              {!isAuthenticated && (
                <div style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', color: '#fcd34d', padding: '0.85rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem', fontSize: '0.88rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span>Please sign in to place an order</span>
                  <button type="button" className="btn btn-primary" onClick={onOpenAuthModal} style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                    <User size={14} /> Login
                  </button>
                </div>
              )}

              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  value={formData.shippingName}
                  onChange={(e) => setFormData({ ...formData, shippingName: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Street Address</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>City</label>
                  <input
                    type="text"
                    className="form-control"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Postal Code</label>
                  <input
                    type="text"
                    className="form-control"
                    required
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.75rem' }}>
                <CreditCard size={20} style={{ color: 'var(--primary)' }} />
                <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>2. Payment Options (Mock Flow)</h2>
              </div>

              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                No real payment gateway integration required. Choose your preferred test option below:
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(15, 23, 42, 0.6)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={formData.paymentMethod === 'card'}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                  />
                  <span style={{ fontWeight: 600 }}>Credit / Debit Card (Mock Authorization)</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(15, 23, 42, 0.6)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={formData.paymentMethod === 'cod'}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                  />
                  <span style={{ fontWeight: 600 }}>Cash on Delivery (COD)</span>
                </label>
              </div>
            </div>
          </div>

          {/* Sidebar breakdown */}
          <div>
            <div className="card" style={{ padding: '1.75rem', position: 'sticky', top: '90px' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.75rem' }}>
                Items Summary ({cart.items.length})
              </h2>

              <div style={{ maxHeight: '220px', overflowY: 'auto', marginBottom: '1rem' }}>
                {cart.items.map((item) => (
                  <div key={item.itemId} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', marginBottom: '0.75rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{item.quantity}x {item.name}</span>
                    <span style={{ fontWeight: 600 }}>${(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', color: 'var(--text-secondary)' }}>
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-glass)', paddingTop: '0.75rem', fontSize: '1.2rem', fontWeight: 800 }}>
                  <span>Total Amount</span>
                  <span style={{ color: 'var(--primary)' }}>${total.toFixed(2)}</span>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading || cart.items.length === 0}
                style={{ width: '100%', padding: '0.9rem', fontSize: '1rem' }}
              >
                <ShieldCheck size={18} />
                <span>{loading ? 'Processing Order...' : 'Confirm & Place Order'}</span>
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;
