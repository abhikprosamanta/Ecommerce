import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    productId: String,
    name: String,
    quantity: Number,
    price: Number
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    customer: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      address: { type: String, required: true }
    },
    items: [orderItemSchema],
    subtotal: Number,
    shipping: Number,
    total: Number,
    status: { type: String, default: "Processing" }
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
