const { pool } = require('../config/db');

const productModel = {
  async getAll({ search, category } = {}) {
    let sql = 'SELECT * FROM products WHERE 1=1';
    const params = [];

    if (category && category !== 'All') {
      sql += ' AND category = ?';
      params.push(category);
    }

    if (search && search.trim() !== '') {
      sql += ' AND (name LIKE ? OR description LIKE ?)';
      const term = `%${search.trim()}%`;
      params.push(term, term);
    }

    sql += ' ORDER BY created_at DESC';

    const [rows] = await pool.query(sql, params);
    return rows;
  },

  async getById(id) {
    const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [id]);
    return rows[0] || null;
  },

  async create({ name, description, price, category, image_url, stock }) {
    const [result] = await pool.query(
      'INSERT INTO products (name, description, price, category, image_url, stock) VALUES (?, ?, ?, ?, ?, ?)',
      [name, description || '', parseFloat(price), category, image_url || '', parseInt(stock, 10) || 0]
    );
    return this.getById(result.insertId);
  },

  async update(id, { name, description, price, category, image_url, stock }) {
    const fields = [];
    const params = [];

    if (name !== undefined) { fields.push('name = ?'); params.push(name); }
    if (description !== undefined) { fields.push('description = ?'); params.push(description); }
    if (price !== undefined) { fields.push('price = ?'); params.push(parseFloat(price)); }
    if (category !== undefined) { fields.push('category = ?'); params.push(category); }
    if (image_url !== undefined) { fields.push('image_url = ?'); params.push(image_url); }
    if (stock !== undefined) { fields.push('stock = ?'); params.push(parseInt(stock, 10)); }

    if (fields.length === 0) return this.getById(id);

    params.push(id);
    const sql = `UPDATE products SET ${fields.join(', ')} WHERE id = ?`;
    await pool.query(sql, params);
    return this.getById(id);
  },

  async delete(id) {
    const [result] = await pool.query('DELETE FROM products WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
};

module.exports = productModel;
