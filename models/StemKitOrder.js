const mongoose = require("mongoose");

const stemKitOrderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    stemKit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StemKit",
      required: true,
    },
    subscriptionType: {
      type: String,
      required: true, // Annual, Bi-Annual, etc.
    },
    price: {
      type: Number,
      required: true,
    },
    shippingInfo: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      phone: { type: String, required: true },
    },
    orderedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);


// 👇 Ensure the model isn't compiled multiple times in watch mode
const StemKitOrder =
  mongoose.models.StemKitOrder ||
  mongoose.model("StemKitOrder", stemKitOrderSchema);

module.exports = StemKitOrder;