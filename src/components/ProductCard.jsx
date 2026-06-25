import React from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { useCart } from "../context/CartContext";
import { ProductImage } from "./ProductImage";

export const ProductCard = ({ product, addToast, compact = false }) => {
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const isWishlisted = isInWishlist(product.id);

  // Format price as Indian Rupees (INR)
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(price);
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    if (addToast) {
      addToast(`${product.name} added to cart!`, "success");
    }
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

  return (
    <div className={`group relative bg-white dark:bg-luxury-charcoal overflow-hidden border border-gold-100/55 dark:border-stone-800/40 luxury-glow-hover flex flex-col h-full font-sans ${compact ? "rounded-lg p-0 text-[10px] shadow-sm hover:shadow-md" : "rounded-xl sm:rounded-2xl"}`}>
      {/* Badges Overlay - Hidden in compact mode */}
      {!compact && (
        <div className="absolute top-2 left-2 sm:top-4 sm:left-4 z-10 flex flex-col gap-1 sm:gap-2">
          {product.isNew && (
            <span className="bg-gold-500 text-stone-950 text-[8px] sm:text-[10px] uppercase font-bold px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-full tracking-wider shadow-sm">
              New
            </span>
          )}
          {product.isBestSeller && (
            <span className="bg-stone-900 text-gold-300 dark:bg-gold-50 dark:text-stone-950 text-[8px] sm:text-[10px] uppercase font-bold px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-full tracking-wider shadow-sm">
              Best Seller
            </span>
          )}
          {product.stock <= 5 && product.stock > 0 && (
            <span className="bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 text-[7px] sm:text-[9px] font-semibold px-1 py-0.5 rounded shadow-sm">
              {product.stock} Left
            </span>
          )}
          {product.stock === 0 && (
            <span className="bg-red-100 text-red-800 dark:bg-red-950/80 dark:text-red-300 text-[7px] sm:text-[9px] font-semibold px-1 py-0.5 rounded shadow-sm">
              Sold Out
            </span>
          )}
        </div>
      )}

      {/* Wishlist Button Overlay */}
      <button
        onClick={handleWishlistToggle}
        className={`absolute z-10 rounded-full flex items-center justify-center text-gray-500 hover:text-red-500 dark:text-gray-300 transition-colors shadow-md backdrop-blur-sm cursor-pointer ${
          compact ? "top-1 right-1 w-5 h-5 bg-white/90 dark:bg-stone-900/90" : "top-2 right-2 sm:top-4 sm:right-4 w-7 h-7 sm:w-9 sm:h-9 bg-white/80 dark:bg-stone-900/80"
        }`}
        aria-label="Toggle Wishlist"
      >
        <Heart size={compact ? 9 : 14} className={isWishlisted ? "fill-red-500 text-red-500" : ""} />
      </button>

      {/* Image Container with Zoom effect */}
      <Link to={`/product/${product.id}`} className="block relative pt-[100%] overflow-hidden bg-stone-100 dark:bg-stone-950">
        <div className="absolute inset-0 w-full h-full transition-transform duration-700 group-hover:scale-105">
          <ProductImage
            src={product.images?.[0]}
            alt={product.name}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
              product.images?.[1] ? "opacity-100 group-hover:opacity-0" : "opacity-100"
            }`}
          />
          {product.images?.[1] && (
            <ProductImage
              src={product.images?.[1]}
              alt={`${product.name} alternate view`}
              className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            />
          )}
        </div>
        {/* Soft elegant vignette gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/10 via-transparent to-transparent opacity-65"></div>
        
        {/* Quick Add Overlay on Hover - Desktop only - Hidden in compact mode */}
        {!compact && (
          <div className="absolute bottom-0 inset-x-0 bg-stone-950/60 backdrop-blur-sm p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 hidden md:flex justify-center z-10">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="w-full bg-gold-500 hover:bg-gold-600 text-stone-950 font-bold uppercase tracking-wider text-[10px] py-2 rounded-xl transition-all duration-300 inline-flex items-center justify-center gap-1.5 cursor-pointer shadow-md disabled:bg-stone-850 disabled:text-stone-600 animate-fade-in"
            >
              <ShoppingCart size={12} />
              <span>Add to Cart</span>
            </button>
          </div>
        )}
      </Link>

      {/* Product Information */}
      <div className={`flex-grow flex flex-col justify-between ${compact ? "p-1.5 sm:p-2.5" : "p-3 sm:p-5"}`}>
        <div>
          {/* Category & Material - Hidden in compact mode */}
          {!compact && (
            <div className="flex justify-between items-center text-[9px] sm:text-[11px] uppercase tracking-wider text-gold-600 dark:text-gold-400 font-semibold mb-1">
              <span>{product.category}</span>
              <span className="hidden sm:inline">{product.material}</span>
            </div>
          )}

          {/* Product Name */}
          <Link to={`/product/${product.id}`} className="block group-hover:text-gold-600 dark:hover:text-gold-400 transition-colors text-left">
            <h3 className={`font-serif font-bold leading-tight text-luxury-black dark:text-white line-clamp-2 ${
              compact ? "text-[9px] sm:text-[11px] min-h-[22px] sm:min-h-[28px] mb-1" : "text-xs sm:text-base md:text-lg min-h-[32px] sm:min-h-[44px]"
            }`}>
              {product.name}
            </h3>
          </Link>

          {/* Specs tags to feel informative - Hidden in compact mode */}
          {!compact && (
            <div className="flex flex-wrap gap-1 mt-1.5">
              <span className="text-[8px] sm:text-[9px] bg-gold-50/50 dark:bg-stone-900 border border-gold-200/20 px-1.5 py-0.5 rounded-md text-stone-600 dark:text-stone-400 font-medium">
                {product.weight || "100% Certified"}
              </span>
              {product.features?.[0] && (
                <span className="text-[8px] sm:text-[9px] bg-gold-50/50 dark:bg-stone-900 border border-gold-200/20 px-1.5 py-0.5 rounded-md text-stone-600 dark:text-stone-400 font-medium">
                  {product.features[0]}
                </span>
              )}
            </div>
          )}

          {/* Rating - Hidden in compact mode */}
          {!compact && (
            <div className="flex items-center space-x-1 mt-2.5 mb-1.5">
              <div className="flex items-center text-amber-500">
                <Star size={11} className="fill-amber-500" />
                <span className="text-[10px] sm:text-xs font-bold text-gray-800 dark:text-gray-200 ml-0.5">
                  {product.rating}
                </span>
              </div>
              <span className="text-[9px] sm:text-[11px] text-gray-400">({product.reviewsCount} reviews)</span>
            </div>
          )}
        </div>

        {/* Pricing and Action Button */}
        <div className={`flex items-center justify-between border-t border-gold-100/30 dark:border-stone-800/40 pt-1.5 mt-1.5 gap-1`}>
          <div className="flex flex-col text-left">
            {!compact && <span className="text-[8px] sm:text-[10px] text-gray-400 uppercase tracking-widest leading-none mb-1">Price</span>}
            <div className="flex flex-wrap items-baseline gap-1 sm:gap-1.5">
              <span className={`font-serif font-bold text-luxury-black dark:text-gold-300 leading-tight ${compact ? "text-[10px] sm:text-xs md:text-sm" : "text-sm sm:text-lg md:text-xl"}`}>
                {formatPrice(product.price)}
              </span>
              {!compact && (
                <>
                  <span className="text-[9px] sm:text-xs text-gray-400 line-through">
                    {formatPrice(Math.round(product.price * 1.15))}
                  </span>
                  <span className="text-[8px] sm:text-[9px] text-emerald-600 dark:text-emerald-400 font-bold font-sans">
                    15% OFF
                  </span>
                </>
              )}
            </div>
          </div>

          {compact ? (
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="flex items-center justify-center gap-1 bg-luxury-black text-white hover:bg-gold-500 hover:text-stone-950 dark:bg-gold-500 dark:text-stone-950 dark:hover:bg-gold-600 disabled:bg-gray-200 disabled:text-gray-400 px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-lg text-[8px] sm:text-[9px] uppercase font-bold tracking-wider transition-all duration-300 shadow-sm cursor-pointer shrink-0"
            >
              <ShoppingCart size={8} />
              <span>Add</span>
            </button>
          ) : (
            <>
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex sm:hidden items-center justify-center gap-1 bg-luxury-black text-white hover:bg-gold-500 hover:text-stone-950 dark:bg-gold-500 dark:text-stone-950 dark:hover:bg-gold-600 disabled:bg-gray-250 disabled:text-gray-400 dark:disabled:bg-stone-850 dark:disabled:text-stone-700 font-semibold px-2.5 py-1.5 rounded-lg text-[9px] uppercase tracking-wider transition-all duration-300 shadow-sm cursor-pointer"
              >
                <ShoppingCart size={11} />
                <span>Add</span>
              </button>
              
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="hidden sm:flex md:hidden items-center justify-center gap-1 bg-luxury-black text-white hover:bg-gold-500 hover:text-stone-950 dark:bg-gold-500 dark:text-stone-950 dark:hover:bg-gold-600 disabled:bg-gray-250 disabled:text-gray-400 dark:disabled:bg-stone-850 dark:disabled:text-stone-700 font-semibold px-3 py-2 rounded-xl text-xs uppercase tracking-wider transition-all duration-300 shadow-sm cursor-pointer"
              >
                <ShoppingCart size={12} />
                <span>Add</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
