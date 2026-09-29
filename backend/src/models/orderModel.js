const { pool } = require('../config/db');

const orderModel = {
  async createOrder(userId) {
    // 1. Fetch user's cart
    const [cartRows] = await pool.query('SELECT id FROM carts WHERE user_id = ?', [userId]);
    if (cartRows.length === 0) {
      const error = new Error('Cart is empty');
      error.statusCode = 400;
      throw error;
    }
    const cartId = cartRows[0].id;

    const [cartItems] = await pool.query(
      `SELECT ci.product_id, ci.quantity, p.name, p.price, p.stock
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.id
       WHERE ci.cart_id = ?`,
      [cartId]
    );

    if (cartItems.length === 0) {
      const error = new Error('Cannot place an order with an empty cart');
      error.statusCode = 400;
      throw error;
    }

    // Check stock for all items
    for (const item of cartItems) {
      if (item.stock < item.quantity) {
        const error = new Error(`Insufficient stock for product "${item.name}". Only ${item.stock} left.`);
        error.statusCode = 400;
        throw error;
      }
    }

    // Calculate total amount
    const totalAmount = cartItems.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);

    // Get database connection for transaction
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      // Create Order
      const [orderResult] = await connection.query(
        'INSERT INTO orders (user_id, total_amount, status) VALUES (?, ?, ?)',
        [userId, totalAmount.toFixed(2), 'PENDING']
      );
      const orderId = orderResult.insertId;

      // Create Order Items & Reduce Product Stock
      for (const item of cartItems) {
        await connection.query(
          'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
          [orderId, item.product_id, item.quantity, parseFloat(item.price)]
        );

        await connection.query(
          'UPDATE products SET stock = stock - ? WHERE id = ?',
          [item.quantity, item.product_id]
        );
      }

      // Clear User Cart Items
      await connection.query('DELETE FROM cart_items WHERE cart_id = ?', [cartId]);

      await connection.commit();
      connection.release();

      return this.getOrderById(orderId, userId);
    } catch (error) {
      await connection.rollback();
      connection.release();
      throw error;
    }
  },

  async getOrdersByUserId(userId) {
    const [orders] = await pool.query(
      `SELECT id, user_id, total_amount, status, created_at
       FROM orders
       WHERE user_id = ?
       ORDER BY created_at DESC`,
      [userId]
    );

    // Fetch items for each order
    for (const order of orders) {
      const [items] = await pool.query(
        `SELECT oi.id, oi.product_id, oi.quantity, oi.price, p.name, p.image_url, p.category
         FROM order_items oi
         LEFT JOIN products p ON oi.product_id = p.id
         WHERE oi.order_id = ?`,
        [order.id]
      );
      order.items = items;
    }

    return orders;
  },

  async getOrderById(orderId, userId) {
    const [orders] = await pool.query(
      `SELECT id, user_id, total_amount, status, created_at
       FROM orders
       WHERE id = ? AND user_id = ?`,
      [orderId, userId]
    );

    if (orders.length === 0) {
      const error = new Error('Order not found');
      error.statusCode = 404;
      throw error;
    }

    const order = orders[0];

    const [items] = await pool.query(
      `SELECT oi.id, oi.product_id, oi.quantity, oi.price, p.name, p.image_url, p.category
       FROM order_items oi
       LEFT JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = ?`,
      [order.id]
    );

    order.items = items;
    return order;
  }
};

module.exports = orderModel;
