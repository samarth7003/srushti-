import pool from "../../config/database.js";

/**
 * Fetch all reviews ordered by created_at DESC
 * @returns {Promise<object[]>}
 */
export const getReviewsDb = async () => {
  const { rows } = await pool.query("SELECT * FROM reviews ORDER BY created_at DESC");
  return rows;
};

/**
 * Add a new review and update average product rating within a database transaction
 * @returns {Promise<object>}
 */
export const addReviewDb = async (reviewId, productId, productName, customerName, rating, comment) => {
  const client = await pool.connect();
  try {
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
    return reviewResult.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};
