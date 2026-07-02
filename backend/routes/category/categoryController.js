import { getCategoriesDb, addCategoryDb, deleteCategoryDb } from "./categorySqlc.js";

// GET all categories
export const getCategories = async (req, res) => {
  try {
    const categories = await getCategoriesDb();
    res.json(categories);
  } catch (error) {
    console.error("Error fetching categories", error);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
};

// POST add a category
export const addCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Category name is required" });
    }
    
    const categories = await addCategoryDb(name);
    res.json(categories);
  } catch (error) {
    console.error("Error adding category", error);
    res.status(500).json({ error: "Failed to add category" });
  }
};

// DELETE a category
export const deleteCategory = async (req, res) => {
  try {
    const { name } = req.params;
    const categories = await deleteCategoryDb(name);
    res.json(categories);
  } catch (error) {
    console.error("Error deleting category", error);
    res.status(500).json({ error: "Failed to delete category" });
  }
};
