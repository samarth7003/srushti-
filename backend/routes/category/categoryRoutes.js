import express from "express";
import { getCategories, addCategory, deleteCategory } from "./categoryController.js";
import { authenticateToken, requireAdmin } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getCategories);
router.post("/", authenticateToken, requireAdmin, addCategory);
router.delete("/:name", authenticateToken, requireAdmin, deleteCategory);

export default router;
