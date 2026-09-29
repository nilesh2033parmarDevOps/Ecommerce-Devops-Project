const orderModel = require('../models/orderModel');

const orderController = {
  async createOrder(req, res, next) {
    try {
      const order = await orderModel.createOrder(req.user.id);
      return res.status(201).json({
        success: true,
        message: 'Order placed successfully.',
        order
      });
    } catch (error) {
      next(error);
    }
  },

  async getOrders(req, res, next) {
    try {
      const orders = await orderModel.getOrdersByUserId(req.user.id);
      return res.status(200).json({
        success: true,
        count: orders.length,
        orders
      });
    } catch (error) {
      next(error);
    }
  },

  async getOrderById(req, res, next) {
    try {
      const { id } = req.params;
      const order = await orderModel.getOrderById(id, req.user.id);
      return res.status(200).json({
        success: true,
        order
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = orderController;
