import React from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingCart, Star, Eye } from "lucide-react";
import { useCart } from "../context/CartContext";
import { ProductImage } from "./ProductImage";
import { animateFlyToCart } from "../utils/animations";

export const ProductCard = ({ product, addToast, compact = false }) => {
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const isWishlisted = isInWishlist(product.id);

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(price);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    animateFlyToCart(e, product.images?.[0]);
    addToCart(product, 1);
    if (addToast) addToast(`${product.name} added to cart!`, "success");
  };

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
    if (addToast) {
      const msg = isWishlisted ? "Removed from wishlist" : "Added to wishlist";
      addToast(`${product.name}: ${msg}`, "info");
    }
  };

  /* ── COMPACT VARIANT (used in horizontal scrollers) ── */
  if (compact) {
    return (
      <div className="group relative bg-white rounded-xl border border-black/[0.05] shadow-[0_4px_16px_rgba(0,0,0,0.02)] overflow-hidden shine-card hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col font-sans">
        {/* Badge */}
        {product.isNew && (
          <div className="absolute top-2 left-2 z-10">
            <span className="bg-gold-500 text-white text-[8px] uppercase font-bold px-2 py-0.5 rounded-full tracking-wider">
              New
            </span>
          </div>
        )}

        {/* Image */}
        <Link to={`/product/${product.id}`} className="block relative pt-[100%] overflow-hidden bg-ivory-100">
          <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-106">
            <ProductImage
              src={product.images?.[0]}
              alt={product.name}
              className={`absolute inset-0 w-full h-full object-cover ${product.images?.[1] ? "opacity-100 group-hover:opacity-0" : ""} transition-opacity duration-500`}
            />
            {product.images?.[1] && (
              <ProductImage
                src={product.images?.[1]}
                alt={`${product.name} alternate`}
                className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              />
            )}
          </div>
          {/* Wishlist */}
          <button
            onClick={handleWishlistToggle}
            className={`absolute bottom-2.5 right-2.5 z-20 hover:scale-110 cursor-pointer drop-shadow-md transition-colors ${
              isWishlisted ? "text-red-500 fill-red-500 animate-heart-pop" : "text-white/90 hover:text-red-500"
            }`}
            aria-label="Toggle Wishlist"
          >
            <Heart strokeWidth={1.2} className={`w-6 h-6 md:w-7 md:h-7 ${isWishlisted ? "fill-red-500" : ""}`} />
          </button>
        </Link>

        {/* Info */}
        <div className="p-1.5 sm:p-3 bg-white space-y-1 sm:space-y-1.5">
          <div>
            <Link to={`/product/${product.id}`}>
              <h3 className="font-serif font-semibold text-[9.5px] sm:text-xs md:text-sm text-ink-900 line-clamp-1 leading-snug hover:text-gold-600 transition-colors">
                {product.name}
              </h3>
            </Link>
            <span className="text-[7px] sm:text-[9px] uppercase tracking-wider text-ink-400 font-medium block leading-none mt-0.5">
              {product.material} &bull; {product.category}
            </span>
          </div>
          <div className="flex items-center justify-between pt-1 border-t border-black/[0.04] gap-1">
            <span className="font-sans font-semibold text-[9.5px] sm:text-sm text-gold-600 shrink-0">
              {formatPrice(product.price)}
            </span>
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="flex items-center justify-center bg-ink-900 hover:bg-gold-500 disabled:bg-ink-200 disabled:text-ink-400 text-white p-1 sm:px-2.5 sm:py-1 rounded-full transition-all duration-200 cursor-pointer shrink-0"
              title="Add to Cart"
            >
              <ShoppingCart size={9} className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
              <span className="hidden sm:inline-block ml-0.5 text-[8.5px] uppercase font-bold tracking-wider">Add</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ── STANDARD VARIANT ────────────────────────────── */
  return (
    <div className="group relative bg-white rounded-2xl border border-black/[0.05] shadow-[0_6px_24px_rgba(0,0,0,0.02)] overflow-hidden shine-card hover:shadow-[0_20px_48px_rgba(0,0,0,0.08)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col font-sans">
      {/* Badges */}
      <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1">
        {product.isNew && (
          <span className="bg-gold-500 text-white text-[7.5px] sm:text-[8px] uppercase font-bold px-2 py-0.5 rounded-full tracking-wider shadow-sm">
            New
          </span>
        )}
        {product.isBestSeller && (
          <span className="bg-ink-900 text-gold-200 text-[7.5px] sm:text-[8px] uppercase font-bold px-2 py-0.5 rounded-full tracking-wider shadow-sm">
            Best Seller
          </span>
        )}
        {product.stock <= 5 && product.stock > 0 && (
          <span className="bg-amber-50 border border-amber-200 text-amber-700 text-[7.5px] sm:text-[9px] font-semibold px-2 py-0.5 rounded-full">
            Only {product.stock} left
          </span>
        )}
        {product.stock === 0 && (
          <span className="bg-red-50 border border-red-200 text-red-600 text-[7.5px] sm:text-[9px] font-semibold px-2 py-0.5 rounded-full">
            Sold Out
          </span>
        )}
      </div>

      {/* Image */}
      <Link to={`/product/${product.id}`} className="block relative pt-[105%] overflow-hidden bg-ivory-100">
        <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-[1.04]">
          <ProductImage
            src={product.images?.[0]}
            alt={product.name}
            className={`absolute inset-0 w-full h-full object-cover ${product.images?.[1] ? "opacity-100 group-hover:opacity-0" : ""} transition-opacity duration-500`}
          />
          {product.images?.[1] && (
            <ProductImage
              src={product.images?.[1]}
              alt={`${product.name} alternate view`}
              className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            />
          )}
        </div>

        {/* Wishlist */}
        <button
          onClick={handleWishlistToggle}
          className={`absolute bottom-3 right-3 z-20 hover:scale-110 cursor-pointer drop-shadow-md transition-colors ${
            isWishlisted ? "text-red-500 fill-red-500 animate-heart-pop" : "text-white/90 hover:text-red-500"
          }`}
          aria-label="Toggle Wishlist"
        >
          <Heart strokeWidth={1.2} className={`w-7 h-7 md:w-9 md:h-9 ${isWishlisted ? "fill-red-500" : ""}`} />
        </button>
      </Link>

      {/* Info */}
      <div className="p-2.5 sm:p-4 bg-white space-y-2.5 sm:space-y-3">
        <div>
          {/* Name */}
          <Link to={`/product/${product.id}`} className="block">
            <h3 className="font-serif font-semibold text-[13px] sm:text-base md:text-[17px] text-ink-900 line-clamp-1 leading-snug hover:text-gold-600 transition-colors">
              {product.name}
            </h3>
          </Link>
          {/* Material & Category */}
          <p className="text-[8px] sm:text-[10px] font-sans font-light text-ink-400 uppercase tracking-widest mt-1">
            {product.material} &bull; {product.category}
          </p>
        </div>

        {/* Price + Add to Cart */}
        <div className="flex items-center justify-between pt-2 border-t border-black/[0.04]">
          <span className="font-sans font-bold text-xs sm:text-base md:text-lg text-gold-600">
            {formatPrice(product.price)}
          </span>
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="flex items-center gap-1 bg-ink-900 hover:bg-gold-500 disabled:bg-ink-100 disabled:text-ink-400 text-white font-bold px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-full text-[8px] sm:text-[10px] uppercase tracking-wider transition-colors cursor-pointer"
          >
            <ShoppingCart size={9} className="sm:w-3 sm:h-3" />
            <span className="hidden sm:inline">Add to Cart</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>
      </div>
    </div>
  );
};
