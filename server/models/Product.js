import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    rating: { type: Number, default: 4.5 },
    stock: { type: Number, default: 10 },
    badge: String,
    color: String,
    image: String,
    description: String
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
