const cartModel = require('../models/cartModel');

const cartController = {
  async getCart(req, res, next) {
    try {
      const cart = await cartModel.getCartByUserId(req.user.id);
      return res.status(200).json({
        success: true,
        cart
      });
    } catch (error) {
      next(error);
    }
  },

  async addToCart(req, res, next) {
    try {
      const { product_id, productId, quantity } = req.body;
      const targetProductId = product_id || productId;

      if (!targetProductId) {
        return res.status(400).json({
          success: false,
          message: 'Product ID is required.'
        });
      }

      const cart = await cartModel.addItem(req.user.id, targetProductId, quantity || 1);
      return res.status(200).json({
        success: true,
        message: 'Item added to cart.',
        cart
      });
    } catch (error) {
      next(error);
    }
  },

  async updateCartItem(req, res, next) {
    try {
      const { itemId } = req.params;
      const { quantity } = req.body;

      if (quantity === undefined) {
        return res.status(400).json({
          success: false,
          message: 'Quantity is required.'
        });
      }

      const cart = await cartModel.updateItemQuantity(req.user.id, itemId, quantity);
      return res.status(200).json({
        success: true,
        message: 'Cart updated.',
        cart
      });
    } catch (error) {
      next(error);
    }
  },

  async removeCartItem(req, res, next) {
    try {
      const { itemId } = req.params;
      const cart = await cartModel.removeItem(req.user.id, itemId);
      return res.status(200).json({
        success: true,
        message: 'Item removed from cart.',
        cart
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = cartController;
