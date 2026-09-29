const { pool } = require('../config/db');

const cartModel = {
  async getOrCreateCartId(userId) {
    const [existing] = await pool.query('SELECT id FROM carts WHERE user_id = ?', [userId]);
    if (existing.length > 0) {
      return existing[0].id;
    }
    const [result] = await pool.query('INSERT INTO carts (user_id) VALUES (?)', [userId]);
    return result.insertId;
  },

  async getCartByUserId(userId) {
    const cartId = await this.getOrCreateCartId(userId);

    const [items] = await pool.query(
      `SELECT 
        ci.id AS itemId,
        ci.cart_id AS cartId,
        ci.product_id AS productId,
        ci.quantity,
        p.name,
        p.price,
        p.image_url AS imageUrl,
        p.category,
        p.stock,
        (p.price * ci.quantity) AS itemTotal
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.id
       WHERE ci.cart_id = ?
       ORDER BY ci.id ASC`,
      [cartId]
    );

    const subtotal = items.reduce((sum, item) => sum + parseFloat(item.itemTotal || 0), 0);

    return {
      cartId,
      userId,
      items,
      subtotal: parseFloat(subtotal.toFixed(2))
    };
  },

  async addItem(userId, productId, quantity = 1) {
    const cartId = await this.getOrCreateCartId(userId);
    const qty = Math.max(1, parseInt(quantity, 10));

    // Check if product exists and check stock
    const [productRows] = await pool.query('SELECT id, stock FROM products WHERE id = ?', [productId]);
    if (productRows.length === 0) {
      const error = new Error('Product not found');
      error.statusCode = 404;
      throw error;
    }

    // Check if item is already in cart
    const [existingItems] = await pool.query(
      'SELECT id, quantity FROM cart_items WHERE cart_id = ? AND product_id = ?',
      [cartId, productId]
    );

    if (existingItems.length > 0) {
      const newQuantity = existingItems[0].quantity + qty;
      await pool.query(
        'UPDATE cart_items SET quantity = ? WHERE id = ?',
        [newQuantity, existingItems[0].id]
      );
    } else {
      await pool.query(
        'INSERT INTO cart_items (cart_id, product_id, quantity) VALUES (?, ?, ?)',
        [cartId, productId, qty]
      );
    }

    return this.getCartByUserId(userId);
  },

  async updateItemQuantity(userId, itemId, quantity) {
    const cartId = await this.getOrCreateCartId(userId);
    const qty = parseInt(quantity, 10);

    // Verify item belongs to user's cart
    const [itemRows] = await pool.query(
      'SELECT id FROM cart_items WHERE id = ? AND cart_id = ?',
      [itemId, cartId]
    );

    if (itemRows.length === 0) {
      const error = new Error('Cart item not found in your cart');
      error.statusCode = 404;
      throw error;
    }

    if (qty <= 0) {
      await pool.query('DELETE FROM cart_items WHERE id = ?', [itemId]);
    } else {
      await pool.query('UPDATE cart_items SET quantity = ? WHERE id = ?', [qty, itemId]);
    }

    return this.getCartByUserId(userId);
  },

  async removeItem(userId, itemId) {
    const cartId = await this.getOrCreateCartId(userId);

    const [result] = await pool.query(
      'DELETE FROM cart_items WHERE id = ? AND cart_id = ?',
      [itemId, cartId]
    );

    if (result.affectedRows === 0) {
      const error = new Error('Cart item not found in your cart');
      error.statusCode = 404;
      throw error;
    }

    return this.getCartByUserId(userId);
  },

  async clearCart(userId) {
    const cartId = await this.getOrCreateCartId(userId);
    await pool.query('DELETE FROM cart_items WHERE cart_id = ?', [cartId]);
  }
};

module.exports = cartModel;
