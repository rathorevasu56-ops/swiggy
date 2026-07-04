const express = require("express");
const auth = require("../middleware/auth");
const User = require("../models/User");

const router = express.Router();
router.use(auth); // every route below requires a logged-in user

router.put("/cart", async (req, res) => {
  try {
    const { cart } = req.body;
    const user = await User.findByIdAndUpdate(req.userId, { cart: cart || [] }, { new: true });
    res.json({ cart: user.cart });
  } catch (err) {
    console.error("Cart sync error:", err);
    res.status(500).json({ error: "Failed to save cart" });
  }
});

router.put("/addresses", async (req, res) => {
  try {
    const { addresses } = req.body;
    const user = await User.findByIdAndUpdate(req.userId, { addresses: addresses || [] }, { new: true });
    res.json({ addresses: user.addresses });
  } catch (err) {
    console.error("Address sync error:", err);
    res.status(500).json({ error: "Failed to save addresses" });
  }
});

router.put("/coupon", async (req, res) => {
  try {
    const { coupon } = req.body;
    const user = await User.findByIdAndUpdate(req.userId, { appliedCoupon: coupon || null }, { new: true });
    res.json({ appliedCoupon: user.appliedCoupon });
  } catch (err) {
    console.error("Coupon sync error:", err);
    res.status(500).json({ error: "Failed to save coupon" });
  }
});

module.exports = router;
