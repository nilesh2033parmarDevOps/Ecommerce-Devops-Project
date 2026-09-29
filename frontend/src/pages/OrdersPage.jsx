import React, { useEffect, useState } from 'react';
import { Package, Clock, Calendar, ChevronDown, ChevronUp, ShoppingBag } from 'lucide-react';
import { orderAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const OrdersPage = ({ onNavigate, onOpenAuthModal }) => {
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await orderAPI.getOrders();
      if (res.data.success) {
        setOrders(res.data.orders);
      }
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'DELIVERED': return 'badge-success';
      case 'CONFIRMED':
      case 'SHIPPED': return 'badge-primary';
      case 'CANCELLED': return 'badge-danger';
      default: return 'badge-warning';
    }
  };

  if (!isAuthenticated) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 1.5rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-glass)' }}>
        <Package size={56} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>Sign in to View Orders</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Log in to view your past purchases, order details, and tracking statuses.</p>
        <button className="btn btn-primary" onClick={onOpenAuthModal}>
          Login / Register
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ textAlignment: 'center', padding: '4rem 0', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem', color: 'var(--text-secondary)' }}>
        <div style={{ width: '24px', height: '24px', border: '3px solid var(--primary-light)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <span>Fetching order history...</span>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 1.5rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-glass)' }}>
        <ShoppingBag size={56} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>No Orders Found</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>You haven't placed any orders yet.</p>
        <button className="btn btn-primary" onClick={() => onNavigate('home')}>
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
        <Package size={28} style={{ color: 'var(--primary)' }} />
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>My Orders ({orders.length})</h1>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {orders.map((order) => {
          const isExpanded = expandedOrderId === order.id;
          const orderDate = new Date(order.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          });

          return (
            <div key={order.id} className="card" style={{ padding: '1.5rem' }}>
              {/* Order Header */}
              <div
                onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', cursor: 'pointer' }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem' }}>
                    <span style={{ fontSize: '1.1rem', fontWeight: 800 }}>Order #{order.id}</span>
                    <span className={`badge ${getStatusBadgeClass(order.status)}`}>{order.status}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    <Calendar size={14} />
                    <span>{orderDate}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Total Paid</span>
                    <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary)' }}>
                      ${parseFloat(order.total_amount).toFixed(2)}
                    </span>
                  </div>

                  <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </button>
                </div>
              </div>

              {/* Order Details (Expandable) */}
              {isExpanded && (
                <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-glass)' }}>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                    Purchased Items ({order.items?.length || 0})
                  </h4>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {order.items?.map((item) => (
                      <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(15, 23, 42, 0.6)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)' }}>
                        <img
                          src={item.image_url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&auto=format&fit=crop&q=80'}
                          alt={item.name}
                          style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '6px' }}
                        />
                        <div style={{ flex: 1 }}>
                          <h5 style={{ fontSize: '0.95rem', fontWeight: 600 }}>{item.name || `Product #${item.product_id}`}</h5>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Quantity: {item.quantity}</span>
                        </div>
                        <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                          ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrdersPage;
