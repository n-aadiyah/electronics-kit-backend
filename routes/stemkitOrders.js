const express = require("express");
const router = express.Router();
const StemKitOrder = require("../models/StemKitOrder");
const StemKit = require("../models/StemKit");
const authMiddleware = require("../middleware/authMiddleware");
// @route   POST /api/stemkit-orders
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { stemKitId, subscriptionType, price, shippingInfo } = req.body;

    console.log("✅ New STEM Kit order request");
    console.log("👉 User:", req.user);
    console.log("🎁 StemKitId:", stemKitId);
    console.log("📦 Subscription:", subscriptionType);
    console.log("💰 Price:", price);
    console.log("📮 Shipping Info:", shippingInfo);

    // Validate required fields
    if (!stemKitId || !subscriptionType || !price || !shippingInfo) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Validate shipping info
    if (
      !shippingInfo.name ||
      !shippingInfo.email ||
      !shippingInfo.address ||
      !shippingInfo.city ||
      !shippingInfo.postalCode ||
      !shippingInfo.phone
    ) {
      return res.status(400).json({ message: "Incomplete shipping information" });
    }

    // Check if stemKit exists
    const stemKit = await StemKit.findById(stemKitId);
    if (!stemKit) {
      return res.status(404).json({ message: "StemKit not found" });
    }

    // Create new order
    const newOrder = new StemKitOrder({
      user: req.user.id,
      stemKit: stemKit._id,
      subscriptionType,
      price,
      shippingInfo,
    });

    const savedOrder = await newOrder.save();
    const populatedOrder = await savedOrder.populate("stemKit");

    res.status(201).json({
      message: "STEM Kit order placed successfully",
      order: populatedOrder,
    });
  } catch (err) {
    console.error("Order Error:", err);
    res.status(500).json({
      message: "Server Error",
      error: err.message,
    });
  }
});

// @route   GET /api/stemkit-orders/myorders
router.get("/myorders", authMiddleware, async (req, res) => {
  try {
    const orders = await StemKitOrder.find({ user: req.user.id })
      .populate("stemKit")
      .sort({ orderedAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;