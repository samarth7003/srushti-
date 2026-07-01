import * as db from "../db/db.js";

const mapProductToFrontend = (row) => ({
  id: row.id,
  name: row.name,
  description: row.description,
  price: parseFloat(row.price),
  category: row.category,
  material: row.material,
  weight: row.weight,
  availability: row.availability,
  stock: parseInt(row.stock),
  rating: parseFloat(row.rating),
  reviewsCount: parseInt(row.reviews_count),
  images: row.images || [],
  features: row.features || [],
  isNew: !!row.is_new,
  isBestSeller: !!row.is_bestseller
});

// GET all products
export const getProducts = async (req, res) => {
  try {
    const { rows } = await db.query("SELECT * FROM products ORDER BY created_at DESC");
    res.json(rows.map(mapProductToFrontend));
  } catch (error) {
    console.error("Error fetching products", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

// POST add a product
export const addProduct = async (req, res) => {
  try {
    const { id, name, description, price, category, material, weight, availability, stock, rating, reviewsCount, images, features, isNew, isBestSeller } = req.body;
    
    const prodId = id || "p_" + Date.now();
    const prodRating = parseFloat(rating) || 5.0;
    const prodReviewsCount = parseInt(reviewsCount) || 0;
    
    const queryText = `
      INSERT INTO products (id, name, description, price, category, material, weight, availability, stock, rating, reviews_count, images, features, is_new, is_bestseller)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      RETURNING *
    `;
    
    const { rows } = await db.query(queryText, [
      prodId, name, description, price, category, material, weight, availability || "In Stock", stock || 0, prodRating, prodReviewsCount, images || [], features || [], isNew || false, isBestSeller || false
    ]);
    
    res.status(201).json(mapProductToFrontend(rows[0]));
  } catch (error) {
    console.error("Error adding product", error);
    res.status(500).json({ error: "Failed to add product" });
  }
};

// PUT update a product
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, category, material, weight, availability, stock, rating, reviewsCount, images, features, isNew, isBestSeller } = req.body;
    
    const queryText = `
      UPDATE products 
      SET name = $1, description = $2, price = $3, category = $4, material = $5, weight = $6, availability = $7, stock = $8, rating = $9, reviews_count = $10, images = $11, features = $12, is_new = $13, is_bestseller = $14
      WHERE id = $15
      RETURNING *
    `;
    
    const { rows } = await db.query(queryText, [
      name, description, price, category, material, weight, availability, stock, rating, reviewsCount, images, features, isNew, isBestSeller, id
    ]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }
    
    res.json(mapProductToFrontend(rows[0]));
  } catch (error) {
    console.error("Error updating product", error);
    res.status(500).json({ error: "Failed to update product" });
  }
};

// DELETE a product
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { rowCount } = await db.query("DELETE FROM products WHERE id = $1", [id]);
    
    if (rowCount === 0) {
      return res.status(404).json({ error: "Product not found" });
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting product", error);
    res.status(500).json({ error: "Failed to delete product" });
  }
};
