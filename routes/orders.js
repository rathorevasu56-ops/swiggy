const express = require("express");
const auth = require("../middleware/auth");
const Order = require("../models/Order");

const router = express.Router();
router.use(auth); // every route below requires a logged-in user

router.get("/", async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.userId }).sort({ date: -1 });
    res.json({ orders });
  } catch (err) {
    console.error("Fetch orders error:", err);
    res.status(500).json({ error: "Failed to load order history" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { order } = req.body;
    if (!order) return res.status(400).json({ error: "Order data required" });

    await Order.create({ ...order, userId: req.userId });
    const orders = await Order.find({ userId: req.userId }).sort({ date: -1 });
    res.status(201).json({ orders });
  } catch (err) {
    console.error("Create order error:", err);
    res.status(500).json({ error: "Failed to save order" });
  }
});

module.exports = router;
