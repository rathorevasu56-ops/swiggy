const mongoose = require("mongoose");

// Matches the shape of items pushed into cart on the frontend
const CartItemSchema = new mongoose.Schema(
  {
    id: Number,
    name: String,
    price: Number,
    qty: Number,
    image: String,
    veg: Boolean,
    desc: String,
  },
  { _id: false, strict: false } // strict:false so extra menu-item fields don't get rejected
);

const AddressSchema = new mongoose.Schema(
  {
    id: Number,
    label: String,
    icon: String,
    address: String,
  },
  { _id: false }
);

const CouponSchema = new mongoose.Schema(
  {
    code: String,
    discount: Number,
    type: String,
    desc: String,
    minOrder: Number,
  },
  { _id: false }
);

const DEFAULT_ADDRESSES = () => [
  { id: 1, label: "Home", address: "42, MG Road, Koramangala, Bengaluru - 560034", icon: "🏠" },
  { id: 2, label: "Work", address: "15th Floor, Prestige Tower, Indiranagar, Bengaluru - 560038", icon: "🏢" },
];

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    phone: { type: String, default: "" },
    avatar: { type: String, default: "" },

    // Everything below persists per-user in MongoDB so it follows them
    // across devices whenever they log back in.
    cart: { type: [CartItemSchema], default: [] },
    addresses: { type: [AddressSchema], default: DEFAULT_ADDRESSES },
    appliedCoupon: { type: CouponSchema, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
