import React from 'react';
import { ShoppingBag, ShieldCheck, Truck, RefreshCw } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{ background: '#090d16', borderTop: '1px solid var(--border-glass)', marginTop: '4rem', padding: '3rem 1.5rem 2rem' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {/* Features bar */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '3rem', paddingBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ background: 'var(--primary-light)', padding: '0.75rem', borderRadius: 'var(--radius-md)', color: 'var(--primary)' }}>
              <Truck size={24} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 600 }}>Express Shipping</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Free delivery on orders over $50</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ background: 'rgba(16, 185, 129, 0.15)', padding: '0.75rem', borderRadius: 'var(--radius-md)', color: 'var(--accent-emerald)' }}>
              <ShieldCheck size={24} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 600 }}>Secure Checkout</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Encrypted JWT authentication</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ background: 'rgba(6, 182, 212, 0.15)', padding: '0.75rem', borderRadius: 'var(--radius-md)', color: 'var(--accent-cyan)' }}>
              <RefreshCw size={24} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 600 }}>Easy Returns</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>30-day money back guarantee</p>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            <ShoppingBag size={18} style={{ color: 'var(--primary)' }} />
            <span>© 2026 ApexStore E-Commerce Application. All rights reserved.</span>
          </div>

          <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            <span>React + Vite</span>
            <span>•</span>
            <span>Express REST API</span>
            <span>•</span>
            <span>MySQL Database</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
