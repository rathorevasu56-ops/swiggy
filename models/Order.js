const mongoose = require("mongoose");

const OrderItemSchema = new mongoose.Schema(
  {
    name: String,
    qty: Number,
    price: Number,
  },
  { _id: false }
);

const OrderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    orderId: { type: String, required: true }, // human-facing ORD###### code from the frontend
    restaurant: String,
    items: { type: [OrderItemSchema], default: [] },
    total: Number,
    paymentMethod: String,
    address: String,
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);
