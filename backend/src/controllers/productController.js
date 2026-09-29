const productModel = require('../models/productModel');

const productController = {
  async getProducts(req, res, next) {
    try {
      const { search, category } = req.query;
      const products = await productModel.getAll({ search, category });
      return res.status(200).json({
        success: true,
        count: products.length,
        products
      });
    } catch (error) {
      next(error);
    }
  },

  async getProductById(req, res, next) {
    try {
      const { id } = req.params;
      const product = await productModel.getById(id);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product with ID ${id} not found.`
        });
      }

      return res.status(200).json({
        success: true,
        product
      });
    } catch (error) {
      next(error);
    }
  },

  async createProduct(req, res, next) {
    try {
      const { name, description, price, category, image_url, stock } = req.body;

      if (!name || price === undefined || !category) {
        return res.status(400).json({
          success: false,
          message: 'Product name, price, and category are required.'
        });
      }

      const newProduct = await productModel.create({
        name,
        description,
        price,
        category,
        image_url,
        stock
      });

      return res.status(201).json({
        success: true,
        message: 'Product created successfully.',
        product: newProduct
      });
    } catch (error) {
      next(error);
    }
  },

  async updateProduct(req, res, next) {
    try {
      const { id } = req.params;
      const existing = await productModel.getById(id);

      if (!existing) {
        return res.status(404).json({
          success: false,
          message: `Product with ID ${id} not found.`
        });
      }

      const updated = await productModel.update(id, req.body);

      return res.status(200).json({
        success: true,
        message: 'Product updated successfully.',
        product: updated
      });
    } catch (error) {
      next(error);
    }
  },

  async deleteProduct(req, res, next) {
    try {
      const { id } = req.params;
      const deleted = await productModel.delete(id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: `Product with ID ${id} not found.`
        });
      }

      return res.status(200).json({
        success: true,
        message: `Product with ID ${id} was deleted successfully.`
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = productController;
