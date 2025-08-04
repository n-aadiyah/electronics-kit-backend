const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const authMiddleware = require('../middleware/authMiddleware');

// GET /api/orders/mine - Get logged-in user's orders
router.get("/mine", authMiddleware, async (req, res) => {
  try {
    const userId = req.user; // ✅ Clean and consistent
    const orders = await Order.find({ user: userId }).populate('items.productId', 'name price image');
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching orders" });
  }
});

// POST /api/orders - Place a new order
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { items, totalAmount, shippingInfo } = req.body;

    if (
      !items || !Array.isArray(items) || items.length === 0 ||
      !totalAmount || !shippingInfo
    ) {
      return res.status(400).json({ error: 'Invalid order data' });
    }
const order = new Order({
  user: req.user, // ✅ Already the user ID string
  items,
  totalAmount,
  shippingInfo
});

    await order.save();
    res.status(201).json({ message: 'Order placed successfully', order });
  } catch (err) {
    console.error('Order Error:', err);
    res.status(500).json({ error: 'Failed to place order' });
  }
});

module.exports = router;
