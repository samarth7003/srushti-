import * as db from "../db/db.js";

// GET all categories
export const getCategories = async (req, res) => {
  try {
    const { rows } = await db.query("SELECT name FROM categories ORDER BY name ASC");
    res.json(rows.map(r => r.name));
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
    
    await db.query(
      "INSERT INTO categories (name) VALUES ($1) ON CONFLICT (name) DO NOTHING",
      [name]
    );
    
    // Return all categories
    const { rows } = await db.query("SELECT name FROM categories ORDER BY name ASC");
    res.json(rows.map(r => r.name));
  } catch (error) {
    console.error("Error adding category", error);
    res.status(500).json({ error: "Failed to add category" });
  }
};

// DELETE a category
export const deleteCategory = async (req, res) => {
  try {
    const { name } = req.params;
    await db.query("DELETE FROM categories WHERE name = $1", [name]);
    
    // Return remaining categories
    const { rows } = await db.query("SELECT name FROM categories ORDER BY name ASC");
    res.json(rows.map(r => r.name));
  } catch (error) {
    console.error("Error deleting category", error);
    res.status(500).json({ error: "Failed to delete category" });
  }
};
