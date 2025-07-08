const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const authMiddleware = require('../middleware/authMiddleware');

// ✅ GET all products (Protected)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// ✅ GET a product by ID (Optional: keep public or protect)
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// ✅ POST a new product (Protected)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, price, description, category } = req.body;

    if (!name || !price || !description || !category) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const product = new Product({ name, price, description, category });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add product' });
  }
});

module.exports = router;





