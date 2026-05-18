import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import productsRouter from "./routes/products.js";
import ordersRouter from "./routes/orders.js";
import Product from "./models/Product.js";
import { seedProducts } from "./seedProducts.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:5173",
  "http://127.0.0.1:5173"
].filter(Boolean);

app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, mongoConnected: Boolean(app.locals.mongoConnected) });
});

app.use("/api/products", productsRouter);
app.use("/api/orders", ordersRouter);

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ message: "Something went wrong on the server." });
});

async function start() {
  if (process.env.MONGO_URI) {
    await mongoose.connect(process.env.MONGO_URI);
    app.locals.mongoConnected = true;

    const count = await Product.countDocuments();
    if (count === 0) {
      await Product.insertMany(seedProducts.map(({ id, ...product }) => product));
    }
  }

  app.listen(PORT, () => {
    console.log(`API running on http://localhost:${PORT}`);
  });
}

start().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
