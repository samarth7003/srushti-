import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Star, Heart, Send, ShieldCheck, Sparkles, Award, Gem, Quote, VolumeX, Volume2, Maximize2, Share2, ChevronLeft, ChevronRight } from "lucide-react";
import { getProducts, getReviews } from "../services/db";
import { ProductCard } from "../components/ProductCard";
import { ProductGridSkeleton } from "../components/LoadingSkeleton";
import { motion, AnimatePresence } from "framer-motion";

export const Home = ({ addToast }) => {
  const [newArrivals, setNewArrivals] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentReviewIdx, setCurrentReviewIdx] = useState(0);

  const quickCategories = [
    {
      name: "Necklaces",
      image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=300&auto=format&fit=crop&q=80",
      path: "/collections?category=Necklace Sets"
    },
    {
      name: "Rings",
      image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=300&auto=format&fit=crop&q=80",
      path: "/collections?category=Rings"
    },
    {
      name: "Earrings",
      image: "https://images.unsplash.com/photo-1630019852942-f89202989a59?w=300&auto=format&fit=crop&q=80",
      path: "/collections?category=Earrings"
    },
    {
      name: "Bangles",
      image: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=300&auto=format&fit=crop&q=80",
      path: "/collections?category=Bangles"
    },
    {
      name: "Bracelets",
      image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=300&auto=format&fit=crop&q=80",
      path: "/collections?category=Bracelets"
    },
    {
      name: "Chains",
      image: "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=300&auto=format&fit=crop&q=80",
      path: "/collections?category=Chains"
    },
    {
      name: "Bridal",
      image: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=300&auto=format&fit=crop&q=80",
      path: "/collections?category=Bridal Collection"
    }
  ];

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const allProducts = await getProducts();
        setNewArrivals(allProducts.filter((p) => p.isNew).slice(0, 3));
        setBestSellers(allProducts.filter((p) => p.isBestSeller).slice(0, 5));
        setTrendingProducts(allProducts.filter((p) => p.isNew).slice(0, 5));
        
        const allReviews = await getReviews();
        setReviews(allReviews.slice(0, 4));
      } catch (err) {
        console.error("Error loading home page products", err);
      } finally {
        setLoading(false);
      }
    };
    loadHomeData();
  }, []);

  // Auto sliding timer for Patron Testimonials
  useEffect(() => {
    if (reviews.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentReviewIdx((prev) => (prev + 1) % reviews.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [reviews]);

  // Sliding Hero Background Images
  const heroImages = [
    "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=1600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=1600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=1600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=1600&auto=format&fit=crop&q=80"
  ];
  const [heroImageIdx, setHeroImageIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroImageIdx((prev) => (prev + 1) % heroImages.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [heroImageIdx]);

  // Cinematic Video Showcases State & Effects
  const [activeVideoIdx, setActiveVideoIdx] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const videoRefs = useRef([]);

  const showcases = [
    {
      title: "The Heritage Choker",
      desc: "Hand-set uncut diamonds & precious gems.",
      video: "https://assets.mixkit.co/videos/preview/mixkit-shining-gems-and-diamonds-on-a-necklace-41709-large.mp4",
      poster: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&auto=format&fit=crop&q=80",
      productName: "Heritage Diamond Choker",
      productPrice: "₹2,45,000",
      productImg: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=100&auto=format&fit=crop&q=80",
      productId: "p1"
    },
    {
      title: "The Royal Bands",
      desc: "Custom 22k gold bands with intricate filigree details.",
      video: "https://assets.mixkit.co/videos/preview/mixkit-jewelry-gold-rings-on-a-display-40135-large.mp4",
      poster: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&auto=format&fit=crop&q=80",
      productName: "Classic Gold Band",
      productPrice: "₹48,000",
      productImg: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=100&auto=format&fit=crop&q=80",
      productId: "p2"
    },
    {
      title: "The Karigar's Craft",
      desc: "Impeccable finishing polished to mirror perfection.",
      video: "https://assets.mixkit.co/videos/preview/mixkit-close-up-of-shiny-golden-jewelry-41708-large.mp4",
      poster: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=600&auto=format&fit=crop&q=80",
      productName: "Handcrafted Gold Kada",
      productPrice: "₹1,85,000",
      productImg: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=100&auto=format&fit=crop&q=80",
      productId: "p4"
    },
    {
      title: "The Solitaire Hoops",
      desc: "Elegant diamond studs for everyday luxury.",
      video: "https://assets.mixkit.co/videos/preview/mixkit-woman-showing-off-her-jewelry-41710-large.mp4",
      poster: "https://images.unsplash.com/photo-1630019852942-f89202989a59?w=600&auto=format&fit=crop&q=80",
      productName: "Solitaire Hoop Earrings",
      productPrice: "₹72,000",
      productImg: "https://images.unsplash.com/photo-1630019852942-f89202989a59?w=100&auto=format&fit=crop&q=80",
      productId: "p3"
    }
  ];

  useEffect(() => {
    videoRefs.current.forEach((videoEl, idx) => {
      if (!videoEl) return;
      if (idx === activeVideoIdx) {
        videoEl.muted = isMuted;
        videoEl.play().catch(() => {});
      } else {
        videoEl.pause();
      }
    });
  }, [activeVideoIdx, isMuted]);


  const handleFullscreen = (idx, e) => {
    e.preventDefault();
    e.stopPropagation();
    const videoEl = videoRefs.current[idx];
    if (videoEl) {
      if (videoEl.requestFullscreen) {
        videoEl.requestFullscreen();
      } else if (videoEl.webkitRequestFullscreen) {
        videoEl.webkitRequestFullscreen();
      } else if (videoEl.msRequestFullscreen) {
        videoEl.msRequestFullscreen();
      }
    }
  };

  const handleShare = (idx, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: showcases[idx].title,
        text: showcases[idx].desc,
        url: window.location.origin + `/product/${showcases[idx].productId}`
      }).catch(() => {});
    } else {
      addToast("Link copied to clipboard!", "success");
      navigator.clipboard.writeText(window.location.origin + `/product/${showcases[idx].productId}`);
    }
  };

  const toggleMute = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsMuted(!isMuted);
  };

  const collections = [
    {
      name: "Necklace Sets",
      desc: "Royal & Majestic Heritage Sets",
      image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&auto=format&fit=crop&q=80",
      path: "/collections?category=Necklace Sets"
    },
    {
      name: "Rings",
      desc: "Engagement Bands & Solitaires",
      image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&auto=format&fit=crop&q=80",
      path: "/collections?category=Rings"
    },
    {
      name: "Earrings",
      desc: "Classic Jhumkas & Studs",
      image: "https://images.unsplash.com/photo-1630019852942-f89202989a59?w=600&auto=format&fit=crop&q=80",
      path: "/collections?category=Earrings"
    },
    {
      name: "Bangles",
      desc: "Heavy Kundan & Filigree Kadas",
      image: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=600&auto=format&fit=crop&q=80",
      path: "/collections?category=Bangles"
    }
  ];

  return (
    <div className="bg-gold-50/30 dark:bg-luxury-black transition-colors duration-300 font-sans overflow-x-hidden">
      {/* 1. Hero Section: Cinematic layout with separate container for the content plaque */}
      <section className="relative flex flex-col items-center justify-center bg-white text-white p-[22px]">
        <div className="w-full flex justify-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full relative overflow-hidden bg-stone-950 border border-gold-500/25 p-[18px] sm:p-9 lg:p-12 gold-shadow-lg rounded-[2%]"
          >
            {/* Background Images specifically on this container div with cross-fade */}
            {heroImages.map((img, idx) => (
              <div 
                key={idx}
                className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out hover:scale-[1.02] transform transition-transform ${
                  idx === heroImageIdx ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                }`}
                style={{
                  backgroundImage: `url('${img}')`
                }}
              />
            ))}
            {/* Elegant dark gradient overlay for text legibility */}
            <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/85 to-stone-950/30 sm:to-transparent z-0"></div>
            
            <div className="relative z-10 max-w-2xl space-y-3 sm:space-y-[18px] text-left">
              <span className="text-gold-400 font-semibold tracking-[0.25em] uppercase text-[10px] sm:text-xs block font-sans">
                The Heritage Boutique
              </span>
              <h1 className="font-serif text-xl sm:text-[38px] lg:text-[46px] font-light leading-tight text-white tracking-wide">
                Where Elegance <br className="hidden sm:inline" />
                <span className="font-serif italic text-gold-gradient">Meets Tradition</span>
              </h1>
              <p className="hidden sm:block text-stone-200 max-w-lg text-[11px] sm:text-sm font-light leading-relaxed font-sans">
                Explore exquisite jewellery handcrafted in certified 22-karat gold and certified diamonds. Designed to elevate your heritage, styled for the modern lifestyle.
              </p>
              <div className="pt-1.5 flex flex-row gap-3">
                <Link
                  to="/collections"
                  className="bg-gold-500 hover:bg-gold-600 text-stone-950 font-bold uppercase tracking-wider text-[10px] sm:text-xs px-4 py-2 rounded-lg transition-all duration-300 shadow-lg hover:scale-105 inline-flex items-center gap-1.5 font-sans"
                >
                  Explore
                  <ArrowRight size={12} />
                </Link>
                <Link
                  to="/collections"
                  className="border border-gold-400/40 text-gold-200 hover:bg-gold-500/10 uppercase tracking-wider text-[10px] sm:text-xs px-4 py-2 rounded-lg transition-all duration-300 font-sans"
                >
                  Shop Now
                </Link>
              </div>

              {/* Horizontal Trust Badges: Hidden on mobile to save space */}
              <div className="pt-6 hidden md:grid grid-cols-4 gap-3 max-w-3xl border-t border-stone-800/30 select-none">
                <div className="flex items-center gap-2 bg-stone-950/70 border border-gold-500/10 p-2 sm:p-2.5 rounded-2xl backdrop-blur-md">
                  <ShieldCheck className="text-gold-400 w-4.5 h-4.5 shrink-0" />
                  <div>
                    <h4 className="text-[9px] uppercase font-bold tracking-wider text-white font-sans">Good Quality</h4>
                    <p className="text-[8px] text-stone-400 font-sans">Certified 22K Gold</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-stone-950/70 border border-gold-500/10 p-2 sm:p-2.5 rounded-2xl backdrop-blur-md">
                  <Sparkles className="text-gold-400 w-4.5 h-4.5 shrink-0" />
                  <div>
                    <h4 className="text-[9px] uppercase font-bold tracking-wider text-white font-sans">Fresh Designs</h4>
                    <p className="text-[8px] text-stone-400 font-sans">Modern Heritage</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-stone-950/70 border border-gold-500/10 p-2 sm:p-2.5 rounded-2xl backdrop-blur-md">
                  <Gem className="text-gold-400 w-4.5 h-4.5 shrink-0" />
                  <div>
                    <h4 className="text-[9px] uppercase font-bold tracking-wider text-white font-sans">Suitable For All</h4>
                    <p className="text-[8px] text-stone-400 font-sans">Everyday & Bridal</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-stone-950/70 border border-gold-500/10 p-2 sm:p-2.5 rounded-2xl backdrop-blur-md">
                  <Award className="text-gold-400 w-4.5 h-4.5 shrink-0" />
                  <div>
                    <h4 className="text-[9px] uppercase font-bold tracking-wider text-white font-sans">100% Certified</h4>
                    <p className="text-[8px] text-stone-400 font-sans">BIS Hallmarked</p>
                  </div>
                </div>
              </div>

            </div>

            {/* 5 Dots Indicator Inside the image container */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex justify-center gap-2.5 z-20">
              {heroImages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setHeroImageIdx(idx)}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    idx === heroImageIdx 
                      ? "bg-gold-500 w-6" 
                      : "bg-white/40 hover:bg-white/80 w-2"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

          </motion.div>
        </div>
      </section>

      {/* Quick Category Icons Slider (Voylla Style) */}
      <section className="py-5 sm:py-10 bg-white border-b border-gold-200/10 text-center">
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-2xl mx-auto mb-5 sm:mb-8 space-y-1">
            <span className="text-gold-600 font-semibold tracking-[0.25em] uppercase text-[10px] sm:text-xs block font-sans">
              Exquisite Creations
            </span>
            <h2 className="text-lg sm:text-2xl font-bold text-stone-900">
              Shop by Category
            </h2>
            <div className="h-0.5 w-12 bg-gold-500 mx-auto mt-2"></div>
          </div>
          
          <div className="grid grid-cols-3 gap-y-4 gap-x-1 md:flex md:flex-row md:flex-wrap md:justify-center md:gap-8 select-none">
            {quickCategories.map((cat, idx) => (
              <Link
                key={idx}
                to={cat.path}
                className={`flex flex-col items-center gap-1 group shrink-0 ${idx === 6 ? "hidden md:flex" : ""}`}
              >
                <div className="w-14 h-14 min-[370px]:w-16 min-[370px]:h-16 sm:w-28 sm:h-28 rounded-full overflow-hidden border border-gold-300/40 group-hover:border-gold-500 transition-all duration-300 shadow-md p-0.5 bg-white">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <span className="text-[8px] sm:text-[10px] font-bold text-stone-900 group-hover:text-gold-600 transition-colors uppercase tracking-wider text-center">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>

          {/* View All Categories Link (Centered at the end of category section) */}
          <div className="mt-5 sm:mt-8 flex justify-center">
            <Link
              to="/collections"
              className="text-[10px] sm:text-xs font-bold text-gold-600 hover:text-gold-500 transition-all flex items-center gap-1.5 uppercase tracking-widest border-b border-transparent hover:border-gold-500 pb-0.5 font-sans cursor-pointer"
            >
              View All Categories
              <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </section>

      {/* 3. Best Sellers: Shows 2 products on mobile, 4 on desktop */}
      <section className="py-6 sm:py-12 lg:py-20 px-4 sm:px-6 max-w-7xl mx-auto border-t border-gold-200/10">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12 space-y-1">
          <span className="text-gold-600 dark:text-gold-400 font-medium tracking-[0.2em] uppercase text-[9px] sm:text-xs block font-sans">
            Most Loved Masterpieces
          </span>
          <h2 className="text-lg sm:text-2xl lg:text-4xl font-bold text-luxury-black dark:text-white">
            Best Sellers
          </h2>
          <div className="h-0.5 w-12 bg-gold-500 mx-auto mt-2"></div>
        </div>

        {loading ? (
          <ProductGridSkeleton count={3} />
        ) : (
          <>
            <div className="grid grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-4">
              {bestSellers.map((product, index) => (
                <div
                  key={product.id}
                  className={index >= 3 ? "hidden lg:block" : ""}
                >
                  <ProductCard product={product} addToast={addToast} compact={true} />
                </div>
              ))}
            </div>

            {/* Centered View All link at the bottom end of Best Sellers */}
            <div className="mt-8 flex justify-center">
              <Link
                to="/collections?filter=best"
                className="text-xs sm:text-sm font-bold text-gold-600 dark:text-gold-400 hover:text-gold-500 transition-all flex items-center gap-1.5 uppercase tracking-widest border-b border-transparent hover:border-gold-500 pb-0.5 font-sans cursor-pointer"
              >
                View All Products
                <ArrowRight size={14} />
              </Link>
            </div>
          </>
        )}
      </section>

      {/* 3.1 Trending: Shows 3 products on mobile, 5 on desktop */}
      <section className="py-6 sm:py-12 lg:py-20 bg-white border-t border-b border-gold-200/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12 space-y-1">
            <span className="text-gold-600 font-medium tracking-[0.2em] uppercase text-[9px] sm:text-xs block font-sans">
              Hot & Fashionable Curations
            </span>
            <h2 className="text-lg sm:text-2xl lg:text-4xl font-bold text-stone-900">
              Trending Now
            </h2>
            <div className="h-0.5 w-12 bg-gold-500 mx-auto mt-2"></div>
          </div>

          {loading ? (
            <ProductGridSkeleton count={3} />
          ) : (
            <>
              <div className="grid grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-4">
                {trendingProducts.map((product, index) => (
                  <div
                    key={product.id}
                    className={index >= 3 ? "hidden lg:block" : ""}
                  >
                    <ProductCard product={product} addToast={addToast} compact={true} />
                  </div>
                ))}
              </div>

              {/* Centered View All link at the bottom end of Trending */}
              <div className="mt-8 flex justify-center">
                <Link
                  to="/collections"
                  className="text-xs sm:text-sm font-bold text-gold-600 hover:text-gold-500 transition-all flex items-center gap-1.5 uppercase tracking-widest border-b border-transparent hover:border-gold-500 pb-0.5 font-sans cursor-pointer"
                >
                  View All Collections
                  <ArrowRight size={14} />
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* 2. Discover Srushti: Bento Grid Showcase (Super compact on mobile) */}
      <section className="py-5 sm:py-8 bg-stone-950 border-b border-t border-gold-800/20 text-center">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-4 sm:mb-6 lg:mb-10 space-y-1">
            <span className="text-gold-400 font-semibold tracking-[0.25em] uppercase text-xs block font-sans">
              THE ART OF SPLENDOR
            </span>
            <h2 className="text-lg sm:text-2xl font-bold text-white">
              Discover Srushti
            </h2>
            <div className="h-0.5 w-16 bg-gold-500 mx-auto mt-2"></div>
          </div>

          {/* Bento Grid: 2 Columns on Mobile, 4 Columns on Desktop (35% height reduction) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 auto-rows-[60px] sm:auto-rows-[120px] md:auto-rows-[140px]">
            
            {/* Box 1: Necklace Sets */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="col-span-1 row-span-1 md:col-span-2 md:row-span-2"
            >
              <Link
                to="/collections?category=Necklace%20Sets"
                className="group relative w-full h-full rounded-xl md:rounded-2xl overflow-hidden border border-gold-200/20 shadow-sm luxury-glow-hover bg-stone-900 flex flex-col justify-end p-2 sm:p-5 block"
              >
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105 opacity-60"
                  style={{ backgroundImage: `url('${collections[0].image}')` }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent z-10"></div>
                <div className="relative z-20 text-left">
                  <span className="hidden md:inline-block bg-gold-500 text-stone-950 text-[8px] uppercase font-bold px-2 py-0.5 rounded-full tracking-wider font-sans mb-1.5">Heritage Category</span>
                  <h3 className="font-serif text-xs sm:text-lg md:text-xl font-bold text-white tracking-wide">Necklaces</h3>
                  <p className="hidden sm:block text-[10px] text-stone-300 font-light font-sans mt-0.5">{collections[0].desc}</p>
                </div>
              </Link>
            </motion.div>

            {/* Box 2: Rings */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="col-span-1 row-span-1 md:row-span-2"
            >
              <Link
                to="/collections?category=Rings"
                className="group relative w-full h-full rounded-xl md:rounded-2xl overflow-hidden border border-gold-200/20 shadow-sm luxury-glow-hover bg-stone-900 flex flex-col justify-end p-2 sm:p-4 block"
              >
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105 opacity-60"
                  style={{ backgroundImage: `url('${collections[1].image}')` }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent z-10"></div>
                <div className="relative z-20 text-left">
                  <span className="hidden md:inline-block bg-gold-500 text-stone-950 text-[8px] uppercase font-bold px-1.5 py-0.5 rounded-full tracking-wider font-sans mb-1.5">Solitaires</span>
                  <h3 className="font-serif text-xs sm:text-lg font-bold text-white tracking-wide">Rings</h3>
                  <p className="hidden sm:block text-[10px] text-stone-300 font-light font-sans mt-0.5">{collections[1].desc}</p>
                </div>
              </Link>
            </motion.div>

            {/* Box 3: Earrings */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="col-span-1 row-span-1"
            >
              <Link
                to="/collections?category=Earrings"
                className="group relative w-full h-full rounded-xl md:rounded-2xl overflow-hidden border border-gold-200/20 shadow-sm luxury-glow-hover bg-stone-900 flex flex-col justify-end p-2 sm:p-4 block"
              >
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105 opacity-60"
                  style={{ backgroundImage: `url('${collections[2].image}')` }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent z-10"></div>
                <div className="relative z-20 text-left">
                  <h3 className="font-serif text-xs sm:text-base font-bold text-white tracking-wide leading-tight">Earrings</h3>
                  <p className="hidden sm:block text-[9px] text-stone-300 font-light font-sans mt-0.5">Jhumkas & Studs</p>
                </div>
              </Link>
            </motion.div>

            {/* Box 4: Bangles */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="col-span-1 row-span-1"
            >
              <Link
                to="/collections?category=Bangles"
                className="group relative w-full h-full rounded-xl md:rounded-2xl overflow-hidden border border-gold-200/20 shadow-sm luxury-glow-hover bg-stone-900 flex flex-col justify-end p-2 sm:p-4 block"
              >
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105 opacity-60"
                  style={{ backgroundImage: `url('${collections[3].image}')` }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent z-10"></div>
                <div className="relative z-20 text-left">
                  <h3 className="font-serif text-xs sm:text-base font-bold text-white tracking-wide leading-tight">Bangles</h3>
                  <p className="hidden sm:block text-[9px] text-stone-300 font-light font-sans mt-0.5">Antique Kadas</p>
                </div>
              </Link>
            </motion.div>

            {/* Box 5: Bespoke Custom consultation (Hidden on mobile) */}
            <div className="hidden md:flex md:col-span-2 md:row-span-1 rounded-2xl p-5 border border-gold-400/20 bg-stone-950 text-left relative overflow-hidden flex flex-col justify-between gold-shadow">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/10 rounded-full blur-3xl"></div>
              <div className="space-y-1 relative z-10">
                <span className="text-gold-400 font-medium tracking-[0.25em] uppercase text-[8px] block font-sans">Karigar Studio</span>
                <h3 className="font-serif text-sm sm:text-base text-white font-bold leading-tight">
                  Bespoke Design Studio
                </h3>
                <p className="text-[10px] text-stone-400 font-light leading-relaxed font-sans">
                  Co-create custom heritage heirlooms with our lead designers. Sketches & 3D renders.
                </p>
              </div>
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] text-gold-400 hover:text-gold-300 font-bold tracking-wider uppercase inline-flex items-center gap-1 mt-2 font-sans"
              >
                Consult on WhatsApp
                <ArrowRight size={10} />
              </a>
            </div>

            {/* Box 6: Flagship Store (Hidden on mobile) */}
            <div className="hidden md:flex md:col-span-1 md:row-span-1 rounded-2xl p-4 border border-gold-900/35 bg-stone-900 text-left flex flex-col justify-between luxury-glow-hover">
              <div className="space-y-0.5">
                <h3 className="font-serif text-sm font-bold text-white leading-tight">Flagship Boutique</h3>
                <p className="text-[9px] text-stone-300 font-light leading-relaxed font-sans">MG Road, Bangalore. Private bridal Suites.</p>
              </div>
              <Link
                to="/contact"
                className="bg-stone-950 text-white hover:bg-gold-500 hover:text-stone-950 py-2 px-3 rounded-lg text-[9px] uppercase tracking-wider font-bold transition-all duration-300 text-center shadow-sm font-sans border border-gold-500/25"
              >
                Book Boutique Visit
              </Link>
            </div>

            {/* Box 7: Quality Assurance (Hidden on mobile) */}
            <div className="hidden md:flex md:col-span-1 md:row-span-1 rounded-2xl p-4 border border-gold-500/25 bg-gold-gradient text-stone-950 text-left flex flex-col justify-between">
              <div className="space-y-0.5">
                <h3 className="font-serif text-sm font-bold leading-tight">100% Purity</h3>
                <p className="text-[9px] text-stone-950/85 font-medium leading-relaxed font-sans">BIS 916 Gold & IGI Certified Diamonds.</p>
              </div>
              <div className="flex items-center gap-1 text-stone-950 text-[9px] font-bold uppercase tracking-wider font-sans">
                <ShieldCheck size={14} />
                <span>Certified Safe</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Cinematic Showcases: Srushti in Motion (Below Discover Srushti) */}
      <section className="py-8 bg-white border-t border-b border-gold-200/10 text-center overflow-x-hidden">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8 space-y-1">
            <span className="text-gold-600 font-semibold tracking-[0.25em] uppercase text-xs block font-sans">
              Handcrafted Brilliance in Motion
            </span>
            <h2 className="font-serif text-xl sm:text-2xl text-stone-900">
              Srushti Cinematic Showcases
            </h2>
            <div className="h-0.5 w-16 bg-gold-500 mx-auto mt-2"></div>
          </div>

          <div className="relative w-full max-w-[280px] sm:max-w-md md:max-w-lg mx-auto flex items-center justify-center overflow-visible py-4 min-h-[420px]">
            {showcases.map((item, idx) => {
              const isActive = idx === activeVideoIdx;
              
              const getCoverflowClass = () => {
                if (isActive) {
                  return "relative z-30 scale-100 opacity-100 translate-x-0 pointer-events-auto border-gold-500/40 shadow-2xl";
                }
                const prevIdx = (activeVideoIdx - 1 + showcases.length) % showcases.length;
                const nextIdx = (activeVideoIdx + 1) % showcases.length;
                
                if (idx === prevIdx) {
                  return "absolute z-10 scale-[0.82] opacity-40 -translate-x-[45%] sm:-translate-x-[50%] pointer-events-none skew-y-1";
                }
                if (idx === nextIdx) {
                  return "absolute z-10 scale-[0.82] opacity-40 translate-x-[45%] sm:translate-x-[50%] pointer-events-none -skew-y-1";
                }
                return "absolute z-0 scale-50 opacity-0 pointer-events-none hidden";
              };

              return (
                <div 
                  key={idx}
                  className={`w-[210px] sm:w-[230px] aspect-[9/16] rounded-2xl overflow-hidden border border-white/10 bg-stone-900 transition-all duration-500 ease-in-out flex flex-col justify-end p-0 ${getCoverflowClass()}`}
                >
                  {/* Video Element */}
                  <video 
                    ref={(el) => (videoRefs.current[idx] = el)}
                    src={item.video}
                    poster={item.poster}
                    loop
                    muted={isMuted}
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover z-0"
                  />

                  {/* Elegant dark vignette gradients */}
                  <div className="absolute top-0 inset-x-0 h-16 bg-gradient-to-b from-black/60 to-transparent z-10"></div>
                  <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-10"></div>

                  {/* Top Header Overlay (only visible on active card) */}
                  {isActive && (
                    <div className="absolute top-3 inset-x-3 flex items-center justify-between z-20 animate-fade-in">
                      <span className="text-[10px] font-medium text-white/90 tracking-wide truncate max-w-[100px] sm:max-w-[120px] font-sans">
                        {item.title}
                      </span>
                      <div className="flex items-center gap-1.5 text-white/80">
                        <button 
                          onClick={(e) => toggleMute(e)}
                          className="hover:text-gold-400 p-0.5 cursor-pointer transition-colors"
                          aria-label={isMuted ? "Unmute video" : "Mute video"}
                        >
                          {isMuted ? <VolumeX size={13} /> : <Volume2 size={13} />}
                        </button>
                        <button 
                          onClick={(e) => handleShare(idx, e)}
                          className="hover:text-gold-400 p-0.5 cursor-pointer transition-colors"
                          aria-label="Share video"
                        >
                          <Share2 size={13} />
                        </button>
                        <button 
                          onClick={(e) => handleFullscreen(idx, e)}
                          className="hover:text-gold-400 p-0.5 cursor-pointer transition-colors"
                          aria-label="Maximize video"
                        >
                          <Maximize2 size={13} />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Large Centered "Unmute Video" button on active if muted */}
                  {isActive && isMuted && (
                    <button 
                      onClick={(e) => toggleMute(e)}
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/60 border border-white/20 hover:bg-gold-500 hover:text-stone-950 text-white rounded-lg px-3 py-1.5 text-[9px] uppercase tracking-wider font-bold transition-all duration-300 backdrop-blur-sm z-20 flex items-center gap-1 cursor-pointer animate-pulse"
                    >
                      <Volume2 size={10} />
                      Unmute video
                    </button>
                  )}

                  {/* Bottom glassmorphic product banner (only visible on active card) */}
                  {isActive && (
                    <div className="absolute bottom-6 inset-x-2.5 bg-black/70 border border-white/10 backdrop-blur-md rounded-xl p-1.5 flex items-center justify-between gap-2 z-20 animate-fade-in shadow-lg">
                      <div className="flex items-center gap-2 min-w-0">
                        <img 
                          src={item.productImg} 
                          alt={item.productName} 
                          className="w-8.5 h-8.5 rounded-lg object-cover border border-white/10 shrink-0" 
                        />
                        <div className="text-left leading-tight min-w-0">
                          <h4 className="text-[10px] font-bold text-white font-sans truncate">
                            {item.productName}
                          </h4>
                          <span className="text-[9px] text-gold-400 font-sans font-medium">
                            {item.productPrice}
                          </span>
                        </div>
                      </div>
                      
                      <Link
                        to={`/product/${item.productId}`}
                        className="bg-white/15 hover:bg-gold-500 hover:text-stone-950 text-gold-200 rounded-full p-1.5 transition-all duration-300 flex items-center justify-center cursor-pointer shrink-0"
                        aria-label="View Product Details"
                      >
                        <ArrowRight size={10} />
                      </Link>
                    </div>
                  )}

                  {/* Tanishq segmented progress bars at the bottom edge */}
                  {isActive && (
                    <div className="absolute bottom-2 inset-x-4 flex gap-1 z-20">
                      {showcases.map((_, dotIdx) => (
                        <div 
                          key={dotIdx}
                          className={`h-[2px] rounded-full transition-all duration-500 flex-grow ${
                            dotIdx === activeVideoIdx ? "bg-gold-500" : "bg-white/35"
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Navigation Arrows */}
            <button
              onClick={() => setActiveVideoIdx((prev) => (prev - 1 + showcases.length) % showcases.length)}
              className="absolute left-[-15px] sm:left-[-35px] md:left-[-45px] z-40 bg-black/60 border border-white/15 hover:bg-gold-500 hover:text-stone-950 text-white rounded-full p-2.5 backdrop-blur-sm transition-all duration-300 cursor-pointer shadow-lg"
              aria-label="Previous Video"
            >
              <ChevronLeft size={16} />
            </button>
            
            <button
              onClick={() => setActiveVideoIdx((prev) => (prev + 1) % showcases.length)}
              className="absolute right-[-15px] sm:right-[-35px] md:right-[-45px] z-40 bg-black/60 border border-white/15 hover:bg-gold-500 hover:text-stone-950 text-white rounded-full p-2.5 backdrop-blur-sm transition-all duration-300 cursor-pointer shadow-lg"
              aria-label="Next Video"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </section>



      {/* 3.2 Quality Assured Trust Center (Kisna & Parakkat Inspired) */}
      <section className="py-6 sm:py-12 px-4 sm:px-6 bg-stone-950 text-white border-t border-gold-800/25">
        <div className="max-w-7xl mx-auto text-center space-y-4 sm:space-y-8">
          <div className="space-y-1 sm:space-y-2">
            <span className="text-gold-400 font-medium tracking-[0.2em] uppercase text-[9px] sm:text-xs block font-sans">
              Our Purity Promise
            </span>
            <h2 className="font-serif text-base sm:text-3xl text-white">
              Srushti Quality Standards
            </h2>
            <div className="h-0.5 w-10 sm:w-12 bg-gold-500 mx-auto mt-1 sm:mt-2"></div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {[
              {
                icon: <ShieldCheck className="text-gold-400 w-6 h-6 sm:w-8 h-8 mx-auto" />,
                title: "100% BIS Hallmarked",
                desc: "Every gold item is certified 22K (916) by the Government of India."
              },
              {
                icon: <Award className="text-gold-400 w-6 h-6 sm:w-8 h-8 mx-auto" />,
                title: "Certified Diamonds",
                desc: "All diamonds are accompanied by authenticity certificates from IGI or GIA."
              },
              {
                icon: <Gem className="text-gold-400 w-6 h-6 sm:w-8 h-8 mx-auto" />,
                title: "Lifetime Exchange",
                desc: "Upgrade or exchange your jewelry easily at prevailing market rates anytime."
              },
              {
                icon: <Sparkles className="text-gold-400 w-6 h-6 sm:w-8 h-8 mx-auto" />,
                title: "Transit Insured",
                desc: "Free insured delivery. We cover any risk until the package reaches your hands."
              }
            ].map((trust, idx) => (
              <div key={idx} className="bg-stone-900 border border-gold-900/35 p-3 sm:p-6 rounded-xl sm:rounded-2xl flex flex-col items-center text-center gap-1.5 sm:gap-3">
                {trust.icon}
                <h3 className="text-[10px] sm:text-sm font-bold text-gold-200 uppercase tracking-wider font-sans">{trust.title}</h3>
                <p className="text-[8px] sm:text-xs text-stone-400 font-light leading-normal sm:leading-relaxed font-sans">{trust.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3.5 Patron Testimonials: Sliding guestbook slider */}
      {reviews.length > 0 && (
        <section className="py-8 lg:py-14 px-4 sm:px-6 bg-white text-stone-950 border-t border-stone-200">
          <div className="max-w-4xl mx-auto text-center space-y-5 relative z-10">
            <div className="space-y-1.5">
              <span className="text-gold-600 font-medium tracking-[0.2em] uppercase text-[10px] block">
                Social Proof & Trust
              </span>
              <h2 className="font-serif text-lg lg:text-3xl text-stone-900">
                Patron Testimonials
              </h2>
              <div className="h-0.5 w-12 bg-gold-500 mx-auto"></div>
            </div>

            <div className="relative min-h-[150px] sm:min-h-[110px] flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentReviewIdx}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-4"
                >
                  <Quote className="text-gold-500/25 mx-auto w-7 h-7 rotate-180" />
                  <p className="font-serif italic text-xs sm:text-lg text-stone-700 font-light leading-relaxed max-w-2xl mx-auto px-4">
                    "{reviews[currentReviewIdx].comment}"
                  </p>
                  
                  <div className="flex flex-col items-center space-y-2">
                    <div className="flex justify-center text-amber-500 gap-1">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <Star
                          key={idx}
                          size={10}
                          className={idx < reviews[currentReviewIdx].rating ? "fill-amber-500 text-amber-500" : "text-stone-300"}
                        />
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <img
                        src={reviews[currentReviewIdx].avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"}
                        alt={reviews[currentReviewIdx].userName}
                        className="w-7 h-7 rounded-full object-cover border border-gold-500/30"
                      />
                      <div className="text-left text-xs font-light">
                        <h4 className="font-serif font-bold text-xs text-stone-900 leading-none">
                          {reviews[currentReviewIdx].userName}
                        </h4>
                        <span className="text-[8px] uppercase tracking-widest text-stone-500 block mt-1 leading-none">
                          Verified Patron &bull; {reviews[currentReviewIdx].productName}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation Dots */}
            <div className="flex justify-center gap-2 pt-1">
              {reviews.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentReviewIdx(idx)}
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                    currentReviewIdx === idx ? "bg-gold-500 scale-125" : "bg-stone-200"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </section>
      )}

    </div>
  );
};
