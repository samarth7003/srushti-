import pool from "../../config/database.js";

/**
 * Fetch all categories ordered alphabetically
 * @returns {Promise<string[]>}
 */
export const getCategoriesDb = async () => {
  const { rows } = await pool.query("SELECT name FROM categories ORDER BY name ASC");
  return rows.map(r => r.name);
};

/**
 * Insert a category and return all categories
 * @param {string} name 
 * @returns {Promise<string[]>}
 */
export const addCategoryDb = async (name) => {
  await pool.query(
    "INSERT INTO categories (name) VALUES ($1) ON CONFLICT (name) DO NOTHING",
    [name]
  );
  return getCategoriesDb();
};

/**
 * Delete a category and return all remaining categories
 * @param {string} name 
 * @returns {Promise<string[]>}
 */
export const deleteCategoryDb = async (name) => {
  await pool.query("DELETE FROM categories WHERE name = $1", [name]);
  return getCategoriesDb();
};
