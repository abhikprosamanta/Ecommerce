import express from "express";
import Order from "../models/Order.js";

const router = express.Router();

router.post("/", async (req, res, next) => {
  try {
    const { customer, items, subtotal, shipping, total } = req.body;

    if (!customer?.name || !customer?.email || !customer?.address || !items?.length) {
      return res.status(400).json({ message: "Customer details and cart items are required." });
    }

    if (req.app.locals.mongoConnected) {
      const order = await Order.create({ customer, items, subtotal, shipping, total });
      return res.status(201).json(order);
    }

    res.status(201).json({
      _id: `demo-${Date.now()}`,
      customer,
      items,
      subtotal,
      shipping,
      total,
      status: "Processing"
    });
  } catch (error) {
    next(error);
  }
});

export default router;
