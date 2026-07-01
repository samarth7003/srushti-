import pool, * as db from "../db/db.js";

// GET all reviews
export const getReviews = async (req, res) => {
  try {
    const { rows } = await db.query("SELECT * FROM reviews ORDER BY created_at DESC");
    res.json(rows.map(r => ({
      id: r.id,
      productId: r.product_id,
      productName: r.product_name,
      customerName: r.customer_name,
      rating: parseInt(r.rating),
      comment: r.comment,
      date: r.created_at.toISOString().split("T")[0]
    })));
  } catch (error) {
    console.error("Error fetching reviews", error);
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
};

// POST add a review
export const addReview = async (req, res) => {
  const client = await pool.connect();
  try {
    const { productId, productName, customerName, rating, comment } = req.body;
    const reviewId = "r_" + Date.now();
    
    await client.query("BEGIN");
    
    // 1. Insert review
    const insertQuery = `
      INSERT INTO reviews (id, product_id, product_name, customer_name, rating, comment)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const reviewResult = await client.query(insertQuery, [
      reviewId, productId, productName, customerName, rating, comment
    ]);
    
    // 2. Update product average rating & reviews count
    const productQuery = "SELECT rating, reviews_count FROM products WHERE id = $1";
    const productResult = await client.query(productQuery, [productId]);
    
    if (productResult.rows.length > 0) {
      const product = productResult.rows[0];
      const oldRating = parseFloat(product.rating) || 5.0;
      const oldReviewsCount = parseInt(product.reviews_count) || 0;
      const newReviewsCount = oldReviewsCount + 1;
      const newRating = parseFloat(((oldRating * oldReviewsCount + rating) / newReviewsCount).toFixed(1));
      
      const updateProductQuery = "UPDATE products SET rating = $1, reviews_count = $2 WHERE id = $3";
      await client.query(updateProductQuery, [newRating, newReviewsCount, productId]);
    }
    
    await client.query("COMMIT");
    
    const r = reviewResult.rows[0];
    res.status(201).json({
      id: r.id,
      productId: r.product_id,
      productName: r.product_name,
      customerName: r.customer_name,
      rating: parseInt(r.rating),
      comment: r.comment,
      date: r.created_at.toISOString().split("T")[0]
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error adding review", error);
    res.status(500).json({ error: "Failed to add review" });
  } finally {
    client.release();
  }
};
