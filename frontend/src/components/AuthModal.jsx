import React, { useState } from 'react';
import { X, Mail, Lock, User, LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from './Toast';

const AuthModal = ({ onClose, initialTab = 'login' }) => {
  const [tab, setTab] = useState(initialTab); // 'login' or 'register'
  const { login, register, loading } = useAuth();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (tab === 'login') {
      const res = await login(formData.email, formData.password);
      if (res.success) {
        addToast(`Welcome back, ${res.user.name}!`, 'success');
        onClose();
      } else {
        addToast(res.message, 'error');
      }
    } else {
      const res = await register(formData.name, formData.email, formData.password);
      if (res.success) {
        addToast(`Account created! Welcome, ${res.user.name}!`, 'success');
        onClose();
      } else {
        addToast(res.message, 'error');
      }
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px' }}>
        <button className="modal-close" onClick={onClose}>
          <X size={20} />
        </button>

        {/* Tab Header */}
        <div style={{ display: 'flex', background: 'rgba(15, 23, 42, 0.6)', padding: '0.25rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', border: '1px solid var(--border-glass)' }}>
          <button
            style={{
              flex: 1,
              padding: '0.6rem',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              background: tab === 'login' ? 'var(--primary)' : 'transparent',
              color: tab === 'login' ? '#fff' : 'var(--text-secondary)',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '0.9rem',
              transition: 'var(--transition-fast)'
            }}
            onClick={() => setTab('login')}
          >
            Sign In
          </button>
          <button
            style={{
              flex: 1,
              padding: '0.6rem',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              background: tab === 'register' ? 'var(--primary)' : 'transparent',
              color: tab === 'register' ? '#fff' : 'var(--text-secondary)',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '0.9rem',
              transition: 'var(--transition-fast)'
            }}
            onClick={() => setTab('register')}
          >
            Register
          </button>
        </div>

        <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.25rem', textAlign: 'center' }}>
          {tab === 'login' ? 'Welcome Back' : 'Create an Account'}
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center', marginBottom: '1.5rem' }}>
          {tab === 'login' ? 'Sign in to access your saved cart and orders' : 'Join ApexStore to place orders and manage items'}
        </p>

        <form onSubmit={handleSubmit}>
          {tab === 'register' && (
            <div className="form-group">
              <label>Full Name</label>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  className="form-control"
                  style={{ paddingLeft: '2.6rem' }}
                  required
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label>Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="email"
                className="form-control"
                style={{ paddingLeft: '2.6rem' }}
                required
                placeholder="name@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="password"
                className="form-control"
                style={{ paddingLeft: '2.6rem' }}
                required
                minLength={6}
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%', marginTop: '1rem', padding: '0.8rem', fontSize: '1rem' }}
          >
            {tab === 'login' ? <LogIn size={18} /> : <UserPlus size={18} />}
            <span>{loading ? 'Processing...' : tab === 'login' ? 'Sign In' : 'Create Account'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
