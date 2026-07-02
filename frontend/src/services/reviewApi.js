import { apiCall } from "./apiHelper.js";

// Reviews CRUD functions
export const getReviews = () => apiCall("/reviews");

export const addReview = (review) => apiCall("/reviews", {
  method: "POST",
  body: JSON.stringify(review),
});
