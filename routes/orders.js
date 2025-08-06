const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const authMiddleware = require('../middleware/authMiddleware');

// @route   POST /api/orders
router.post('/', authMiddleware, async (req, res) => {
   console.log("Incoming order request:", req.body); 
  try {
    const { items, totalAmount, shippingInfo } = req.body;

    console.log("✅ New order request received");
    console.log("👉 Authenticated user:", req.user);
    console.log("🛒 Items:", items);
    console.log("💰 Total Amount:", totalAmount);
    console.log("📦 Shipping Info:", shippingInfo);

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'No items to order' });
    }

    const orderItems = [];

    for (const item of items) {
      if (!item.productId || !item.quantity || item.quantity <= 0) {
        return res.status(400).json({
          message: 'Each item must have a valid productId and quantity',
        });
      }

      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({
          message: `Product not found: ${item.productId}`,
        });
      }

      // ✅ push clean item
      orderItems.push({
        productId: product._id,
        quantity: item.quantity,
      });
    }

    if (!totalAmount || typeof totalAmount !== 'number' || totalAmount <= 0) {
      return res.status(400).json({ message: 'Invalid total amount' });
    }

    if (
      !shippingInfo ||
      !shippingInfo.name ||
      !shippingInfo.email ||
      !shippingInfo.address ||
      !shippingInfo.city ||
      !shippingInfo.postalCode ||
      !shippingInfo.phone
    ) {
      return res.status(400).json({ message: 'Incomplete shipping information' });
    }

     const newOrder = new Order({
      user: req.user.id,
      items: req.body.items,
      totalAmount: req.body.totalAmount,
      shippingInfo: req.body.shippingInfo,
    });

    const savedOrder = await newOrder.save();
const populatedOrder = await savedOrder.populate("items.productId");
     res.status(201).json(populatedOrder);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/myorders", authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate("items.productId")
      .sort({ orderedAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
