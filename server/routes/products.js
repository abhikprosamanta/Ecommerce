import express from "express";
import Product from "../models/Product.js";
import { seedProducts } from "../seedProducts.js";

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const { category, q } = req.query;
    const hasDatabase = Boolean(req.app.locals.mongoConnected);
    let products = hasDatabase ? await Product.find().lean() : seedProducts;

    if (category && category !== "All") {
      products = products.filter((product) => product.category === category);
    }

    if (q) {
      const term = q.toLowerCase();
      products = products.filter((product) =>
        `${product.name} ${product.category} ${product.description}`.toLowerCase().includes(term)
      );
    }

    res.json(products);
  } catch (error) {
    next(error);
  }
});

export default router;
