import React, { useState, useEffect } from "react";
import { getReviews, addReview, getProducts } from "../services/db";
import { uploadImage } from "../services/storage";
import { Star, MessageSquare, Plus, Check } from "lucide-react";

export const Reviews = ({ addToast }) => {
  const [reviews, setReviews] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form States
  const [showAddForm, setShowAddForm] = useState(false);
  const [userName, setUserName] = useState("");
  const [selectedProductId, setSelectedProductId] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Fetch reviews & products
  const loadReviewsData = async () => {
    try {
      const dbReviews = await getReviews();
      const dbProducts = await getProducts();
      setReviews(dbReviews);
      setProducts(dbProducts);
      if (dbProducts.length > 0 && !selectedProductId) {
        setSelectedProductId(dbProducts[0].id);
      }
    } catch (err) {
      console.error("Error loading reviews data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviewsData();
  }, []);

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploading(true);
      try {
        const previewUrl = await uploadImage(file);
        setAvatarPreview(previewUrl);
        addToast("Avatar image uploaded!", "success");
      } catch (err) {
        console.error("Avatar upload failed", err);
        addToast("Failed to upload image. Try again.", "error");
      } finally {
        setUploading(false);
      }
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!userName || !comment) {
      addToast("Please enter your name and write a review.", "error");
      return;
    }

    setSubmitting(true);
    try {
      // Find product name
      const matchedProduct = products.find((p) => p.id === selectedProductId);
      const productName = matchedProduct ? matchedProduct.name : "Exclusive Design";

      const newReview = {
        userName,
        productId: selectedProductId,
        productName,
        rating,
        comment,
        avatar: avatarPreview || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
      };

      await addReview(newReview);
      addToast("Thank you for your feedback! Review posted successfully.", "success");
      
      // Reset form & reload
      setUserName("");
      setComment("");
      setAvatarPreview("");
      setShowAddForm(false);
      await loadReviewsData();
    } catch (err) {
      console.error("Failed to post review", err);
      addToast("Failed to post review. Try again.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  // Stats Math
  const averageRating = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : "5.0";

  const getStarPercentage = (star) => {
    if (reviews.length === 0) return 0;
    const matchCount = reviews.filter((r) => r.rating === star).length;
    return Math.round((matchCount / reviews.length) * 100);
  };

  return (
    <div className="bg-gold-50/20 dark:bg-luxury-black transition-colors duration-300 font-sans text-left py-12 px-6">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gold-100/10 pb-6">
          <div className="space-y-2">
            <h1 className="font-serif text-4xl font-light text-luxury-black dark:text-gold-200">
              Patron Reviews
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-light">
              Read verified testimonials from Srushti Jewellery patrons and share your own experience.
            </p>
          </div>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-gold-500 hover:bg-gold-600 text-stone-950 px-6 py-3 rounded-xl text-xs uppercase tracking-wider font-bold transition-all shadow-md flex items-center gap-1.5 self-start md:self-auto cursor-pointer"
          >
            <Plus size={14} /> Write A Review
          </button>
        </div>

        {/* Add Review Form Dropdown */}
        {showAddForm && (
          <form
            onSubmit={handleSubmitReview}
            className="bg-white dark:bg-luxury-charcoal p-6 rounded-2xl border border-gold-400/30 shadow-lg space-y-4 animate-slide-up"
          >
            <h3 className="font-serif text-lg font-bold text-luxury-black dark:text-white border-b border-stone-100 dark:border-stone-850 pb-2">
              Share Your Srushti Experience
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-gray-500 uppercase">Your Name *</label>
                <input
                  type="text"
                  required
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Enter name"
                  className="w-full bg-stone-50 dark:bg-stone-900 border border-gold-200/50 dark:border-stone-800 rounded-xl p-3 text-sm focus:outline-none focus:border-gold-500 text-luxury-black dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-gray-500 uppercase">Product Purchased</label>
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full bg-stone-50 dark:bg-stone-900 border border-gold-200/50 dark:border-stone-800 rounded-xl p-3 text-sm focus:outline-none focus:border-gold-500 text-luxury-black dark:text-white font-medium"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-gray-500 uppercase">Star Rating</label>
                <div className="flex items-center gap-1.5 h-11">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setRating(s)}
                      className="text-amber-400 hover:scale-110 transition-transform"
                    >
                      <Star size={24} className={s <= rating ? "fill-amber-400" : "text-gray-300"} />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-gray-500 uppercase">Review Message *</label>
                <textarea
                  required
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share details of the design craftsmanship, fit, packaging..."
                  className="w-full bg-stone-50 dark:bg-stone-900 border border-gold-200/50 dark:border-stone-800 rounded-xl p-3 text-sm focus:outline-none focus:border-gold-500 text-luxury-black dark:text-white min-h-[90px]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-gray-500 uppercase">Profile Image (Optional)</label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="bg-stone-50 dark:bg-stone-900 border border-dashed border-gold-300/50 rounded-xl p-3 text-sm text-center text-gray-400 font-semibold hover:border-gold-500 min-h-[46px] flex items-center justify-center">
                    {uploading ? "Uploading..." : avatarPreview ? "Change Image" : "Upload Picture"}
                  </div>
                </div>
                {avatarPreview && (
                  <div className="flex gap-2 items-center mt-2 pl-2">
                    <img src={avatarPreview} alt="Profile" className="w-10 h-10 rounded-full object-cover" />
                    <span className="text-[10px] text-emerald-500 font-bold">Image loaded successfully!</span>
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-gold-500 hover:bg-gold-600 text-stone-950 font-bold uppercase tracking-wider py-3 rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              {submitting ? "Posting Review..." : "Submit Review"}
            </button>
          </form>
        )}

        {/* Reviews Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-white dark:bg-luxury-charcoal p-6 sm:p-8 rounded-3xl border border-gold-100/50 dark:border-stone-850/40 shadow-sm">
          {/* Average count */}
          <div className="md:col-span-4 text-center space-y-2">
            <span className="text-gray-400 uppercase tracking-widest text-xs font-semibold">Average Rating</span>
            <div className="font-serif text-6xl font-extrabold text-luxury-black dark:text-gold-200">
              {averageRating}
            </div>
            <div className="flex justify-center text-amber-500 gap-1.5">
              {Array.from({ length: 5 }).map((_, idx) => (
                <Star
                  key={idx}
                  size={16}
                  className={idx < Math.round(averageRating) ? "fill-amber-500" : ""}
                />
              ))}
            </div>
            <p className="text-xs text-gray-400">Based on {reviews.length} ratings</p>
          </div>

          {/* Progress graph */}
          <div className="md:col-span-8 space-y-2 text-xs font-light text-gray-500">
            {[5, 4, 3, 2, 1].map((star) => (
              <div key={star} className="flex items-center gap-3">
                <span className="w-3 text-right font-semibold">{star}</span>
                <Star size={12} className="text-amber-500 fill-amber-500 shrink-0" />
                <div className="flex-grow bg-stone-100 dark:bg-stone-900 h-2.5 rounded-full overflow-hidden border border-stone-200/20">
                  <div
                    className="h-full bg-gold-500 rounded-full"
                    style={{ width: `${getStarPercentage(star)}%` }}
                  />
                </div>
                <span className="w-8 text-right font-medium">{getStarPercentage(star)}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials List */}
        {loading ? (
          <div className="space-y-4 animate-pulse">
            {[1, 2].map((i) => (
              <div key={i} className="h-32 bg-stone-200 dark:bg-stone-900 rounded-2xl"></div>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {reviews.map((r) => (
              <div
                key={r.id}
                className="bg-white dark:bg-luxury-charcoal p-6 rounded-2xl border border-gold-100/50 dark:border-stone-850/40 shadow-sm space-y-4"
              >
                {/* Author row */}
                <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-900/40 pb-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={r.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"}
                      alt={r.userName}
                      className="w-10 h-10 rounded-full object-cover border border-gold-300/30"
                    />
                    <div>
                      <h4 className="font-serif font-bold text-luxury-black dark:text-stone-200 text-sm">
                        {r.userName}
                      </h4>
                      <span className="text-[10px] text-gray-400">
                        {new Date(r.date).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "long",
                          year: "numeric"
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="flex text-amber-500 gap-0.5">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Star key={idx} size={14} className={idx < r.rating ? "fill-amber-500" : "text-gray-200"} />
                    ))}
                  </div>
                </div>

                {/* Review details */}
                <div className="space-y-2 font-light">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-gold-600 dark:text-gold-400">
                    Product: {r.productName}
                  </span>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-light">
                    "{r.comment}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
