import express from "express";
import { getProducts, addProduct, updateProduct, deleteProduct } from "./productController.js";
import { authenticateToken, requireAdmin } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getProducts);
router.post("/", authenticateToken, requireAdmin, addProduct);
router.put("/:id", authenticateToken, requireAdmin, updateProduct);
router.delete("/:id", authenticateToken, requireAdmin, deleteProduct);

export default router;
