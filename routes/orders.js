const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const authMiddleware = require('../middleware/authMiddleware');

// ✅ POST /api/orders - Place a new order
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { items, totalAmount } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0 || !totalAmount) {
      return res.status(400).json({ error: 'Invalid order data' });
    }

    const order = new Order({
       user: req.user.userId || req.user,
        items,
      totalAmount
    });

    await order.save();
    res.status(201).json({ message: 'Order placed successfully', order });
  } catch (err) {
    console.error('Order Error:', err);
    res.status(500).json({ error: 'Failed to place order' });
  }
});
module.exports = router;


