import pool from "../../config/database.js";

/**
 * Get all products ordered by created_at DESC
 * @returns {Promise<object[]>}
 */
export const getProductsDb = async () => {
  const { rows } = await pool.query("SELECT * FROM products ORDER BY created_at DESC");
  return rows;
};

/**
 * Add a new product to the database
 * @returns {Promise<object>}
 */
export const addProductDb = async (prodId, name, description, price, category, material, weight, availability, stock, rating, reviewsCount, images, features, isNew, isBestSeller) => {
  const queryText = `
    INSERT INTO products (id, name, description, price, category, material, weight, availability, stock, rating, reviews_count, images, features, is_new, is_bestseller)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
    RETURNING *
  `;
  const { rows } = await pool.query(queryText, [
    prodId, name, description, price, category, material, weight, availability, stock, rating, reviewsCount, images, features, isNew, isBestSeller
  ]);
  return rows[0];
};

/**
 * Update an existing product in the database
 * @returns {Promise<object|null>}
 */
export const updateProductDb = async (id, name, description, price, category, material, weight, availability, stock, rating, reviewsCount, images, features, isNew, isBestSeller) => {
  const queryText = `
    UPDATE products 
    SET name = $1, description = $2, price = $3, category = $4, material = $5, weight = $6, availability = $7, stock = $8, rating = $9, reviews_count = $10, images = $11, features = $12, is_new = $13, is_bestseller = $14
    WHERE id = $15
    RETURNING *
  `;
  const { rows } = await pool.query(queryText, [
    name, description, price, category, material, weight, availability, stock, rating, reviewsCount, images, features, isNew, isBestSeller, id
  ]);
  return rows[0] || null;
};

/**
 * Delete a product by id
 * @param {string} id 
 * @returns {Promise<boolean>}
 */
export const deleteProductDb = async (id) => {
  const { rowCount } = await pool.query("DELETE FROM products WHERE id = $1", [id]);
  return rowCount > 0;
};
