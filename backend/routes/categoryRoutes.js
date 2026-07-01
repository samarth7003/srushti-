import express from "express";
import { getCategories, addCategory, deleteCategory } from "../controllers/categoryController.js";

const router = express.Router();

router.get("/", getCategories);
router.post("/", addCategory);
router.delete("/:name", deleteCategory);

export default router;
