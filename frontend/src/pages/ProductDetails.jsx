import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getProducts } from "../services/productApi";
import { useCart } from "../context/CartContext";
import { ProductImage } from "../components/ProductImage";
import { DetailsSkeleton } from "../components/LoadingSkeleton";
import { ProductCard } from "../components/ProductCard";
import { Heart, Share2, ShoppingBag, MessageSquare, ShieldCheck, RefreshCw } from "lucide-react";
import { animateFlyToCart } from "../utils/animations";

export const ProductDetails = ({ addToast }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [zoomStyle, setZoomStyle] = useState({ display: "none" });

  useEffect(() => {
    const loadProductData = async () => {
      setLoading(true);
      try {
        const allProducts = await getProducts();
        const found = allProducts.find((p) => p.id === id);
        if (found) {
          setProduct(found);
          setSelectedImageIdx(0);
          // Load related products of same category
          const related = allProducts
            .filter((p) => p.category === found.category && p.id !== found.id)
            .slice(0, 3);
          setRelatedProducts(related);
        } else {
          setProduct(null);
        }
      } catch (err) {
        console.error("Error loading product details", err);
      } finally {
        setLoading(false);
      }
    };
    loadProductData();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12">
        <DetailsSkeleton />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 text-center font-sans">
        <span className="text-4xl">🔎</span>
        <h2 className="font-serif text-3xl font-bold text-luxury-black dark:text-white mt-4">
          Masterpiece Not Found
        </h2>
        <p className="text-gray-500 max-w-sm mx-auto font-light mt-2 mb-6">
          The product you are trying to view does not exist in our catalog or has been moved.
        </p>
        <Link
          to="/collections"
          className="bg-gold-500 text-stone-950 px-8 py-3.5 rounded-xl text-xs uppercase tracking-wider font-bold hover:bg-gold-600 transition-colors"
        >
          Explore Catalog
        </Link>
      </div>
    );
  }

  const isWishlisted = isInWishlist(product.id);

  // Format Price as INR
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(price);
  };

  // Image zoom handler on hover
  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({
      display: "block",
      backgroundImage: `url(${product.images?.[selectedImageIdx]})`,
      backgroundPosition: `${x}% ${y}%`,
      backgroundSize: "200%"
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({ display: "none" });
  };

  // Copy share link
  const handleShare = () => {
    const shareUrl = window.location.href;
    navigator.clipboard.writeText(shareUrl);
    addToast("Product link copied to clipboard!", "success");
  };

  // WhatsApp prefilled enquiry link
  const getWhatsAppEnquiryUrl = () => {
    const bizNumber = "+919876543210";
    const text = `Namaste Srushti Jewellery. I am interested in purchasing the following piece:
Product: ${product.name}
Code: ${product.id}
Price: ${formatPrice(product.price)}
Link: ${window.location.href}`;
    return `https://wa.me/${bizNumber}?text=${encodeURIComponent(text)}`;
  };

  const handleAddToCart = (e) => {
    animateFlyToCart(e, product.images?.[selectedImageIdx]);
    addToCart(product, 1);
    addToast(`${product.name} added to cart!`, "success");
  };

  const handleBuyNow = () => {
    addToCart(product, 1);
    navigate("/checkout");
  };

  return (
    <div className="bg-gold-50/20 dark:bg-luxury-black transition-colors duration-300 font-sans py-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Back Link */}
        <div className="mb-6 text-left">
          <Link
            to="/collections"
            className="text-xs font-semibold text-gold-600 dark:text-gold-400 hover:text-gold-500 uppercase tracking-widest"
          >
            &larr; Back to Collections
          </Link>
        </div>

        {/* Product Details Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">
          {/* 1. Left Column: Image Gallery & Zoom */}
          <div className="lg:col-span-6 space-y-4">
            {/* Main zoomable frame */}
            <div
              className="relative aspect-square rounded-2xl overflow-hidden bg-stone-100 dark:bg-stone-950 border border-gold-200/40 dark:border-stone-850/40 shadow-sm cursor-zoom-in group"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              {/* Product Vector Image */}
              <ProductImage
                src={product.images?.[selectedImageIdx] || "/images/products/necklace-1.svg"}
                alt={product.name}
                className="w-full h-full object-cover"
              />

              {/* Hover Zoom overlay panel */}
              {/* Note: This is an overlay element displaying magnified details of SVGs/Base64 */}
              <div
                style={zoomStyle}
                className="absolute inset-0 z-20 pointer-events-none border border-gold-400/30 rounded-2xl bg-no-repeat bg-white dark:bg-stone-950"
              />
              
              {/* Zoom prompt tooltip */}
              <div className="absolute bottom-4 right-4 bg-stone-900/60 text-white text-[10px] px-2.5 py-1 rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                Hover to Zoom
              </div>
            </div>

            {/* Thumbnail Carousel */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto py-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIdx(idx)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden bg-stone-50 dark:bg-stone-950 border transition-all cursor-pointer ${
                      selectedImageIdx === idx
                        ? "border-gold-500 ring-1 ring-gold-500 scale-105"
                        : "border-gold-200/50 dark:border-stone-850 hover:border-gold-300"
                    }`}
                  >
                    <ProductImage src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 2. Right Column: Product Metadata & Checkout CTAs */}
          <div className="lg:col-span-6 text-left space-y-6 flex flex-col justify-between">
            <div>
              {/* Category, weight & stock */}
              <div className="flex justify-between items-center text-xs uppercase tracking-wider text-gold-600 dark:text-gold-400 font-semibold mb-2">
                <span>
                  {product.category} &bull; {product.material}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] ${
                    product.stock > 0
                      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                      : "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300"
                  }`}
                >
                  {product.stock > 0 ? `In Stock (Only ${product.stock} units)` : "Out of Stock"}
                </span>
              </div>

              {/* Product Title */}
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-luxury-black dark:text-white leading-snug">
                {product.name}
              </h1>

              {/* Price Tag */}
              <div className="my-4">
                <span className="text-[10px] text-gray-400 uppercase tracking-widest block leading-none mb-1">
                  Total Price (Incl. GST)
                </span>
                <span className="font-serif text-3xl font-extrabold text-luxury-black dark:text-gold-300">
                  {formatPrice(product.price)}
                </span>
              </div>

              {/* Technical Specifications details */}
              <div className="bg-stone-50 dark:bg-luxury-charcoal/50 p-4 rounded-xl border border-gold-200/20 my-4 text-xs space-y-2 grid grid-cols-2 gap-y-2">
                <div>
                  <span className="text-gray-400 block font-light">Gross Weight:</span>
                  <span className="font-semibold text-luxury-black dark:text-white">{product.weight || "N/A"}</span>
                </div>
                <div>
                  <span className="text-gray-400 block font-light">Metal Certification:</span>
                  <span className="font-semibold text-luxury-black dark:text-white">BIS Hallmark 916</span>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-400 block font-light">Key Features:</span>
                  <div className="flex flex-wrap gap-2 mt-1.5">
                    {product.features?.map((f, i) => (
                      <span key={i} className="bg-gold-50 dark:bg-stone-900 border border-gold-300/30 text-gold-700 dark:text-gold-300 px-2 py-0.5 rounded text-[10px]">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Product Description */}
              <div className="space-y-2">
                <h4 className="font-serif font-bold text-luxury-black dark:text-gold-200 uppercase tracking-wider text-xs">
                  Description
                </h4>
                <p className="text-sm font-light text-gray-600 dark:text-gray-400 leading-relaxed">
                  {product.description}
                </p>
              </div>
            </div>

            {/* Action buttons CTAs */}
            <div className="space-y-4 pt-6 border-t border-gold-200/20">
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={(e) => handleAddToCart(e)}
                  disabled={product.stock === 0}
                  className="bg-stone-900 text-white hover:bg-stone-800 dark:bg-stone-850 dark:hover:bg-stone-750 disabled:bg-gray-200 disabled:text-gray-400 dark:disabled:bg-stone-900 dark:disabled:text-stone-750 py-3.5 px-6 rounded-xl text-xs uppercase tracking-wider font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShoppingBag size={16} /> Add to Cart
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={product.stock === 0}
                  className="bg-gold-500 hover:bg-gold-600 text-stone-950 disabled:bg-gold-200/50 disabled:text-stone-400 py-3.5 px-6 rounded-xl text-xs uppercase tracking-wider font-bold transition-all hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                >
                  Buy Masterpiece
                </button>
              </div>

              <div className="flex gap-2">
                {/* Enquire on WhatsApp */}
                <a
                  href={getWhatsAppEnquiryUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-1/2 border border-emerald-500 hover:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 py-3.5 px-6 rounded-xl text-xs uppercase tracking-wider font-bold text-center flex items-center justify-center gap-2"
                >
                  <MessageSquare size={16} /> Enquire on WhatsApp
                </a>

                {/* Wishlist toggle */}
                <button
                  onClick={() => {
                    toggleWishlist(product);
                    const msg = isWishlisted ? "Removed from wishlist" : "Added to wishlist";
                    addToast(`${product.name}: ${msg}`, "info");
                  }}
                  className="w-1/4 border border-gold-300/40 text-gray-500 hover:text-red-500 dark:text-gray-300 py-3.5 rounded-xl flex items-center justify-center transition-colors cursor-pointer"
                  title="Add to Wishlist"
                >
                  <Heart size={18} className={isWishlisted ? "fill-red-500 text-red-500" : ""} />
                </button>

                {/* Share button */}
                <button
                  onClick={handleShare}
                  className="w-1/4 border border-gold-300/40 text-gray-500 hover:text-gold-500 dark:text-gray-300 py-3.5 rounded-xl flex items-center justify-center transition-colors cursor-pointer"
                  title="Share Design Link"
                >
                  <Share2 size={18} />
                </button>
              </div>

              {/* Guarantees */}
              <div className="flex items-center justify-between text-[10px] text-gray-400 border-t border-gold-100/10 dark:border-stone-850/20 pt-4 mt-2">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-gold-500" />
                  <span>BIS Hallmarked</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <RefreshCw size={14} className="text-gold-500" />
                  <span>10 Day Returns</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span>💎</span>
                  <span>100% Certified Jewels</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="border-t border-gold-100/20 pt-16">
            <div className="text-left mb-10 space-y-1">
              <span className="text-gold-600 dark:text-gold-400 font-medium tracking-[0.2em] uppercase text-xs block">
                Patron Choice Pairings
              </span>
              <h3 className="font-serif text-2xl md:text-3xl font-bold text-luxury-black dark:text-white">
                Related Creations
              </h3>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} addToast={addToast} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
