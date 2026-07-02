import { getReviewsDb, addReviewDb } from "./reviewSqlc.js";

// GET all reviews
export const getReviews = async (req, res) => {
  try {
    const reviews = await getReviewsDb();
    res.json(reviews.map(r => ({
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
  try {
    const { productId, productName, customerName, rating, comment } = req.body;
    const reviewId = "r_" + Date.now();
    
    const r = await addReviewDb(reviewId, productId, productName, customerName, rating, comment);
    
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
    console.error("Error adding review", error);
    res.status(500).json({ error: "Failed to add review" });
  }
};
