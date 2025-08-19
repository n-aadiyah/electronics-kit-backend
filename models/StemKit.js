const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema({
  type: { type: String, required: true },
  price: { type: Number, required: true },
  installments: { type: Number, required: true },
});

const stemKitSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  description: String,
  subscriptions: [subscriptionSchema],
  category: { type: String, required: true },
});

const StemKit = mongoose.model("StemKit", stemKitSchema);
module.exports = StemKit;
