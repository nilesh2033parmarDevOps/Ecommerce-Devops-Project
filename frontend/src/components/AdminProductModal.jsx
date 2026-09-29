import React, { useState } from 'react';
import { X, Plus, Edit, Trash2, CheckCircle2, Package } from 'lucide-react';
import { productAPI } from '../services/api';
import { useToast } from './Toast';

const AdminProductModal = ({ products, onClose, onRefreshProducts }) => {
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState('list'); // 'list' or 'form'
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Electronics',
    image_url: '',
    stock: 10
  });

  const handleStartCreate = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'Electronics',
      image_url: '',
      stock: 10
    });
    setActiveTab('form');
  };

  const handleStartEdit = (prod) => {
    setEditingProduct(prod);
    setFormData({
      name: prod.name,
      description: prod.description || '',
      price: prod.price,
      category: prod.category || 'Electronics',
      image_url: prod.image_url || '',
      stock: prod.stock
    });
    setActiveTab('form');
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete product "${name}"?`)) return;
    try {
      const res = await productAPI.delete(id);
      if (res.data.success) {
        addToast(`Product "${name}" deleted.`, 'success');
        onRefreshProducts();
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to delete product.', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        const res = await productAPI.update(editingProduct.id, formData);
        if (res.data.success) {
          addToast(`Updated product "${formData.name}" successfully!`, 'success');
          onRefreshProducts();
          setActiveTab('list');
        }
      } else {
        const res = await productAPI.create(formData);
        if (res.data.success) {
          addToast(`Created new product "${formData.name}" successfully!`, 'success');
          onRefreshProducts();
          setActiveTab('list');
        }
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to save product.', 'error');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '850px' }}>
        <button className="modal-close" onClick={onClose}>
          <X size={22} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Product Inventory Manager</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Live testing interface for POST, PUT, DELETE /api/products endpoints</p>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              className={`btn ${activeTab === 'list' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab('list')}
              style={{ fontSize: '0.85rem', padding: '0.5rem 0.9rem' }}
            >
              All Products ({products.length})
            </button>
            <button
              className={`btn ${activeTab === 'form' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={handleStartCreate}
              style={{ fontSize: '0.85rem', padding: '0.5rem 0.9rem' }}
            >
              <Plus size={15} />
              <span>New Product</span>
            </button>
          </div>
        </div>

        {activeTab === 'list' ? (
          <div style={{ maxHeight: '420px', overflowY: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-glass)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '0.75rem' }}>Image</th>
                  <th style={{ padding: '0.75rem' }}>Name</th>
                  <th style={{ padding: '0.75rem' }}>Category</th>
                  <th style={{ padding: '0.75rem' }}>Price</th>
                  <th style={{ padding: '0.75rem' }}>Stock</th>
                  <th style={{ padding: '0.75rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding: '0.75rem' }}>
                      <img
                        src={p.image_url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&auto=format&fit=crop&q=80'}
                        alt={p.name}
                        style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
                      />
                    </td>
                    <td style={{ padding: '0.75rem', fontWeight: 600 }}>{p.name}</td>
                    <td style={{ padding: '0.75rem', color: 'var(--text-secondary)' }}>{p.category}</td>
                    <td style={{ padding: '0.75rem', fontWeight: 700 }}>${parseFloat(p.price).toFixed(2)}</td>
                    <td style={{ padding: '0.75rem' }}>
                      <span className={`badge ${p.stock > 0 ? 'badge-success' : 'badge-danger'}`}>
                        {p.stock}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                      <button
                        onClick={() => handleStartEdit(p)}
                        className="btn btn-secondary"
                        style={{ padding: '0.4rem 0.6rem', marginRight: '0.4rem' }}
                        title="Edit Product (PUT /api/products/:id)"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id, p.name)}
                        className="btn btn-danger"
                        style={{ padding: '0.4rem 0.6rem' }}
                        title="Delete Product (DELETE /api/products/:id)"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label>Product Name *</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Sony WH-1000XM5 Headphones"
                />
              </div>

              <div className="form-group">
                <label>Category *</label>
                <select
                  className="form-control"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="Electronics">Electronics</option>
                  <option value="Fashion">Fashion</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Home & Kitchen">Home & Kitchen</option>
                  <option value="Furniture">Furniture</option>
                </select>
              </div>

              <div className="form-group">
                <label>Price ($) *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  className="form-control"
                  required
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="99.99"
                />
              </div>

              <div className="form-group">
                <label>Stock Quantity *</label>
                <input
                  type="number"
                  min="0"
                  className="form-control"
                  required
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  placeholder="25"
                />
              </div>

              <div className="form-group">
                <label>Image URL</label>
                <input
                  type="url"
                  className="form-control"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                />
              </div>

              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label>Description</label>
                <textarea
                  className="form-control"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Provide product details..."
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setActiveTab('list')}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                <CheckCircle2 size={16} />
                <span>{editingProduct ? 'Save Changes' : 'Create Product'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AdminProductModal;
