const express = require("express");
const StemKit = require("../models/StemKit");

const router = express.Router();

// Get all kits
router.get("/", async (req, res) => {
  try {
    const stemkits = await StemKit.find();
    res.json(stemkits);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single kit
router.get("/:id", async (req, res) => {
  try {
    const stemkit = await StemKit.findById(req.params.id);
    if (!stemkit) return res.status(404).json({ message: "Not found" });
    res.json(stemkit);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 👉 Create a new kit (POST)
router.post("/", async (req, res) => {
  try {
    const stemkit = new StemKit(req.body);
    await stemkit.save();
    res.status(201).json(stemkit);
  } catch (error) {
    res.status(400).json({ message: "Invalid data", error: error.message });
  }
});

module.exports = router;
