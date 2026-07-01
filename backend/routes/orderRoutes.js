import express from "express";
import { getOrders, createOrder, updateOrderStatus, approveUpiPayment } from "../controllers/orderController.js";

const router = express.Router();

router.get("/", getOrders);
router.post("/", createOrder);
router.put("/:id/status", updateOrderStatus);
router.put("/:id/approve-payment", approveUpiPayment);

export default router;
