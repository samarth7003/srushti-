import { getProductsDb, addProductDb, updateProductDb, deleteProductDb } from "./productSqlc.js";

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
    const products = await getProductsDb();
    res.json(products.map(mapProductToFrontend));
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
    
    const product = await addProductDb(
      prodId, name, description, price, category, material, weight, availability || "In Stock", stock || 0, prodRating, prodReviewsCount, images || [], features || [], isNew || false, isBestSeller || false
    );
    
    res.status(201).json(mapProductToFrontend(product));
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
    
    const product = await updateProductDb(
      id, name, description, price, category, material, weight, availability, stock, rating, reviewsCount, images, features, isNew, isBestSeller
    );
    
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    
    res.json(mapProductToFrontend(product));
  } catch (error) {
    console.error("Error updating product", error);
    res.status(500).json({ error: "Failed to update product" });
  }
};

// DELETE a product
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const success = await deleteProductDb(id);
    
    if (!success) {
      return res.status(404).json({ error: "Product not found" });
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting product", error);
    res.status(500).json({ error: "Failed to delete product" });
  }
};
