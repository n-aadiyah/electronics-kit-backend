const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const authMiddleware = require('../middleware/authMiddleware');

// ✅ GET all products — 🔓 Public
router.get('/', async (req, res) => {
  console.log("📦 GET /api/products called");
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// ✅ GET product by ID — 🔓 Public
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// ✅ POST a new product — 🔐 Only Admin
router.post('/', authMiddleware,  async (req, res) => {
  try {
    const { name, price, description, category, image } = req.body;

    if (!name || !price || !description || !category || !image) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const product = new Product({ name, price, description, category, image });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    console.error("Product POST error:", err);
    res.status(500).json({ error: 'Failed to add product' });
  }
});

module.exports = router;
