const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const authMiddleware = require('../middleware/authMiddleware');

// ✅ Admin check middleware
// const isAdmin = (req, res, next) => {
//   if (req.user?.isAdmin) {
//     next(); // Allow admin
//   } else {
//     return res.status(403).json({ error: "Access denied. Admins only." });
//   }
// };
t
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
router.post('/', authMiddleware, isAdmin, async (req, res) => {
  try {
    const { name, price, description, category } = req.body;

    if (!name || !price || !description || !category) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const product = new Product({ name, price, description, category });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    console.error("Product POST error:", err);
    res.status(500).json({ error: 'Failed to add product' });
  }
});

module.exports = router;
