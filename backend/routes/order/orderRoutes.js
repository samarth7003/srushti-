import express from "express";
import { getOrders, createOrder, updateOrderStatus, approveUpiPayment } from "./orderController.js";
import { authenticateToken, requireAdmin } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authenticateToken, requireAdmin, getOrders);
router.post("/", createOrder);
router.put("/:id/status", authenticateToken, requireAdmin, updateOrderStatus);
router.put("/:id/approve-payment", authenticateToken, requireAdmin, approveUpiPayment);

export default router;
