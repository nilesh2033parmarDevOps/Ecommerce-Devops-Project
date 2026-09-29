import React from 'react';
import { ShoppingBag, Search, ShoppingCart, Package, User, LogOut, PlusCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = ({ activePage, setActivePage, searchQuery, setSearchQuery, onOpenAuthModal, onOpenAdminModal }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const { cartCount } = useCart();

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {/* Brand Logo */}
        <a href="#" className="brand-logo" onClick={(e) => { e.preventDefault(); setActivePage('home'); }}>
          <ShoppingBag className="brand-icon" size={26} />
          <span>ApexStore</span>
        </a>

        {/* Search Bar */}
        <div className="nav-search">
          <Search className="search-icon" size={18} />
          <input
            type="text"
            placeholder="Search products by name or description..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (activePage !== 'home') setActivePage('home');
            }}
          />
        </div>

        {/* Action Buttons & Links */}
        <div className="nav-actions">
          {/* Home Link */}
          <button
            className={`nav-btn ${activePage === 'home' ? 'nav-btn-primary' : ''}`}
            onClick={() => setActivePage('home')}
          >
            Home
          </button>

          {/* Admin Manage Products */}
          <button
            className="nav-btn"
            onClick={onOpenAdminModal}
            title="Add / Edit / Delete Products API Demo"
            style={{ borderColor: 'rgba(6, 182, 212, 0.4)', color: '#06b6d4' }}
          >
            <PlusCircle size={16} />
            <span>Manage Products</span>
          </button>

          {/* Cart Link with Badge */}
          <button
            className={`nav-btn ${activePage === 'cart' ? 'nav-btn-primary' : ''}`}
            onClick={() => setActivePage('cart')}
          >
            <ShoppingCart size={18} />
            <span>Cart</span>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>

          {/* User Auth Section */}
          {isAuthenticated ? (
            <>
              <button
                className={`nav-btn ${activePage === 'orders' ? 'nav-btn-primary' : ''}`}
                onClick={() => setActivePage('orders')}
              >
                <Package size={18} />
                <span>Orders</span>
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: '0.25rem' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    background: 'rgba(255,255,255,0.06)',
                    padding: '0.4rem 0.75rem',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.85rem'
                  }}
                >
                  <User size={14} style={{ color: 'var(--primary)' }} />
                  <span style={{ fontWeight: 600 }}>{user?.name}</span>
                </div>
                <button
                  className="nav-btn"
                  onClick={logout}
                  title="Logout"
                  style={{ padding: '0.55rem 0.65rem' }}
                >
                  <LogOut size={16} style={{ color: 'var(--accent-rose)' }} />
                </button>
              </div>
            </>
          ) : (
            <button
              className="nav-btn nav-btn-primary"
              onClick={onOpenAuthModal}
            >
              <User size={16} />
              <span>Login / Register</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
