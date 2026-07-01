import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight, Star, ShieldCheck, Sparkles, Award, Gem, Quote,
  VolumeX, Volume2, Maximize2, Share2, ChevronLeft, ChevronRight,
  Gift, Truck, RotateCcw, BadgeCheck, MapPin, Heart
} from "lucide-react";
import { getProducts, getReviews } from "../services/db";
import { ProductCard } from "../components/ProductCard";
import { ProductGridSkeleton } from "../components/LoadingSkeleton";
import { motion, AnimatePresence } from "framer-motion";

/* ─────────────────────────────────────────────────────────
   HOME PAGE
───────────────────────────────────────────────────────── */
export const Home = ({ addToast }) => {
  const [newArrivals, setNewArrivals] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentReviewIdx, setCurrentReviewIdx] = useState(0);

  /* ── Category pills ──────────────────────────────── */
  const quickCategories = [
    { name: "Necklaces",  image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=300&auto=format&fit=crop&q=80",  path: "/collections?category=Necklace Sets" },
    { name: "Rings",      image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=300&auto=format&fit=crop&q=80",  path: "/collections?category=Rings" },
    { name: "Earrings",   image: "https://images.unsplash.com/photo-1630019852942-f89202989a59?w=300&auto=format&fit=crop&q=80",  path: "/collections?category=Earrings" },
    { name: "Bangles",    image: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=300&auto=format&fit=crop&q=80",  path: "/collections?category=Bangles" },
    { name: "Bracelets",  image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=300&auto=format&fit=crop&q=80",  path: "/collections?category=Bracelets" },
    { name: "Chains",     image: "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=300&auto=format&fit=crop&q=80",  path: "/collections?category=Chains" },
    { name: "Bridal",     image: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=300&auto=format&fit=crop&q=80",  path: "/collections?category=Bridal Collection" },
    { name: "Anklets",    image: "https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?w=300&auto=format&fit=crop&q=80",  path: "/collections?category=Anklets" }
  ];

  /* ── Data loading ────────────────────────────────── */
  useEffect(() => {
    const load = async () => {
      try {
        const all = await getProducts();
        setNewArrivals(all.filter((p) => p.isNew).slice(0, 4));
        setBestSellers(all.filter((p) => p.isBestSeller).slice(0, 10));
        setTrendingProducts(all.filter((p) => p.isNew).slice(0, 10));
        const allReviews = await getReviews();
        setReviews(allReviews.slice(0, 6));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (reviews.length <= 1) return;
    const t = setInterval(() => setCurrentReviewIdx((p) => (p + 1) % reviews.length), 6000);
    return () => clearInterval(t);
  }, [reviews]);

  /* ── Hero slider ─────────────────────────────────── */
  const heroSlides = [
    {
      image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=1600&auto=format&fit=crop&q=80",
      tag: "New Arrivals 2025",
      heading: "Wear Your\nLegacy",
      sub: "Handcrafted 22K gold jewellery for the woman who commands every room."
    },
    {
      image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=1600&auto=format&fit=crop&q=80",
      tag: "Engagement Collection",
      heading: "Begin With\nPerfection",
      sub: "Certified diamond solitaires and custom gold bands for your forever moment."
    },
    {
      image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1600&auto=format&fit=crop&q=80",
      tag: "Heritage Bridal",
      heading: "Crafted for\nYour Day",
      sub: "Exquisite bridal sets with timeless Kundan, Polki & diamond craftsmanship."
    },
    {
      image: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=1600&auto=format&fit=crop&q=80",
      tag: "Everyday Luxury",
      heading: "Subtle &\nStunning",
      sub: "Delicate everyday pieces that add the perfect touch of gold to any look."
    }
  ];

  const [heroIdx, setHeroIdx] = useState(0);
  const [slideDir, setSlideDir] = useState(1);

  const goToSlide = (idx) => {
    setSlideDir(idx > heroIdx ? 1 : -1);
    setHeroIdx(idx);
  };

  useEffect(() => {
    const t = setInterval(() => {
      setSlideDir(1);
      setHeroIdx((p) => (p + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(t);
  }, []);

  /* ── Video showcases ─────────────────────────────── */
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
      desc: "Custom 22k gold bands with intricate filigree.",
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
    videoRefs.current.forEach((vid, idx) => {
      if (!vid) return;
      if (idx === activeVideoIdx) { vid.muted = isMuted; vid.play().catch(() => {}); }
      else vid.pause();
    });
  }, [activeVideoIdx, isMuted]);

  const handleFullscreen = (idx, e) => {
    e.preventDefault(); e.stopPropagation();
    const v = videoRefs.current[idx];
    if (v) (v.requestFullscreen || v.webkitRequestFullscreen || v.msRequestFullscreen)?.call(v);
  };

  const handleShare = (idx, e) => {
    e.preventDefault(); e.stopPropagation();
    if (navigator.share) {
      navigator.share({ title: showcases[idx].title, url: `${window.location.origin}/product/${showcases[idx].productId}` }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${window.location.origin}/product/${showcases[idx].productId}`);
      addToast?.("Link copied!", "success");
    }
  };

  /* ── Collection cards ────────────────────────────── */
  const collections = [
    { name: "Necklace Sets", desc: "Royal & Majestic Heritage Sets",       image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&auto=format&fit=crop&q=80", path: "/collections?category=Necklace Sets",    span: "col-span-1 md:col-span-2 row-span-1 md:row-span-2" },
    { name: "Rings",         desc: "Engagement Bands & Solitaires",        image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&auto=format&fit=crop&q=80", path: "/collections?category=Rings",             span: "col-span-1 row-span-1 md:row-span-2" },
    { name: "Earrings",      desc: "Classic Jhumkas & Studs",              image: "https://images.unsplash.com/photo-1630019852942-f89202989a59?w=600&auto=format&fit=crop&q=80", path: "/collections?category=Earrings",          span: "col-span-1 row-span-1" },
    { name: "Bangles",       desc: "Antique Kundan & Filigree Kadas",      image: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=600&auto=format&fit=crop&q=80", path: "/collections?category=Bangles",           span: "col-span-1 row-span-1" }
  ];

  /* ── Trust icons ─────────────────────────────────── */
  const trustItems = [
    { icon: <BadgeCheck className="w-7 h-7 text-gold-500" />, title: "BIS 916 Hallmarked",    desc: "Every gold item is certified 22K by the Government of India." },
    { icon: <Award        className="w-7 h-7 text-gold-500" />, title: "IGI/GIA Diamonds",     desc: "All diamonds carry authenticated IGI or GIA certificates." },
    { icon: <RotateCcw    className="w-7 h-7 text-gold-500" />, title: "Lifetime Exchange",    desc: "Upgrade or exchange at prevailing market rates, anytime." },
    { icon: <Truck        className="w-7 h-7 text-gold-500" />, title: "Free Insured Delivery", desc: "We cover all transit risk until your order safely arrives." }
  ];

  /* ───────────────────────────────────────────────── */
  return (
    <div className="bg-ivory-100 font-sans overflow-x-hidden">

      {/* ════════════════════════════════════════════
          1 · HERO SLIDER
      ════════════════════════════════════════════ */}
      <section className="relative w-full overflow-hidden bg-ink-950" style={{ minHeight: "clamp(520px,76vh,780px)" }}>
        {/* Sliding background */}
        <AnimatePresence initial={false} custom={slideDir}>
          <motion.div
            key={heroIdx}
            custom={slideDir}
            variants={{
              enter: (d) => ({ x: d > 0 ? "100%" : "-100%" }),
              center: { x: 0 },
              exit:  (d) => ({ x: d > 0 ? "-100%" : "100%" })
            }}
            initial="enter" animate="center" exit="exit"
            transition={{ duration: 0.65, ease: "easeInOut" }}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${heroSlides[heroIdx].image}')` }}
          />
        </AnimatePresence>

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-center px-6 sm:px-10 lg:px-20 py-16 max-w-7xl mx-auto w-full" style={{ minHeight: "clamp(520px,76vh,780px)" }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={heroIdx}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.55, ease: "easeOut" }}
              className="max-w-2xl space-y-5 text-white"
            >
              <span className="inline-block text-white text-[10px] sm:text-xs font-semibold tracking-[0.22em] uppercase border border-white/30 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm font-sans">
                {heroSlides[heroIdx].tag}
              </span>
              <h1 className="font-serif text-3xl sm:text-5xl lg:text-7xl font-semibold leading-[1.1] tracking-tight whitespace-pre-line text-white">
                {heroSlides[heroIdx].heading}
              </h1>
              <p className="text-white text-sm sm:text-base font-light leading-relaxed max-w-lg font-sans">
                {heroSlides[heroIdx].sub}
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <Link
                  to="/collections"
                  className="inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-400 text-white font-semibold text-xs sm:text-sm uppercase tracking-widest px-6 py-3 rounded-full transition-all duration-300 shadow-lg hover:-translate-y-0.5 font-sans"
                >
                  Explore Collection <ArrowRight size={14} />
                </Link>
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 border border-white/30 text-white hover:bg-white/10 font-medium text-xs sm:text-sm uppercase tracking-widest px-6 py-3 rounded-full transition-all duration-300 backdrop-blur-sm font-sans"
                >
                  Our Story
                </Link>
              </div>

              {/* Trust badges on hero */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-5 gap-y-2 pt-5 max-w-xl">
                {[
                  { icon: <ShieldCheck size={16} />, label: "BIS Hallmarked" },
                  { icon: <Sparkles    size={16} />, label: "Modern Design" },
                  { icon: <Gem         size={16} />, label: "IGI Certified" },
                  { icon: <Award       size={16} />, label: "Lifetime Exchange" }
                ].map((b) => (
                  <div key={b.label} className="flex items-center gap-2 text-white">
                    <span className="text-gold-300 shrink-0">{b.icon}</span>
                    <span className="text-[10px] sm:text-xs font-medium font-sans leading-none text-white">{b.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Slide dots */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => goToSlide(i)}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${i === heroIdx ? "bg-gold-400 w-8" : "bg-white/30 hover:bg-white/60 w-2"}`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════════
          2 · SHOP BY CATEGORY
      ════════════════════════════════════════════ */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-10 space-y-1">
            <span className="section-kicker block">Discover</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-ink-900">Shop by Category</h2>
            <div className="h-px w-14 bg-gold-400 mx-auto mt-3" />
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-8 gap-4 sm:gap-5 md:gap-6">
            {quickCategories.map((cat, i) => (
              <Link
                key={i}
                to={cat.path}
                className="flex flex-col items-center gap-2.5 group"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-22 md:h-22 rounded-xl overflow-hidden border border-ink-100 group-hover:border-gold-400 transition-all duration-300 shadow-sm group-hover:shadow-lg group-hover:-translate-y-1 bg-white">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <span className="text-[9px] sm:text-[10px] md:text-xs font-semibold text-ink-600 group-hover:text-gold-600 transition-colors uppercase tracking-wider text-center">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link to="/collections" className="inline-flex items-center gap-1.5 text-xs font-semibold text-gold-600 hover:text-gold-500 transition-colors uppercase tracking-widest">
              View All Categories <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ════════════════════════════════════════════
          3 · BEST SELLERS
      ════════════════════════════════════════════ */}
      <section className="py-12 sm:py-16 bg-ivory-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-10 space-y-1">
            <span className="section-kicker block">Most Loved</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-ink-900">Best Sellers</h2>
            <div className="h-px w-14 bg-gold-400 mx-auto mt-3" />
          </div>

          {loading ? (
            <ProductGridSkeleton count={5} />
          ) : (
            <>
              <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-4">
                {bestSellers.map((product) => (
                  <div key={product.id}>
                    <ProductCard product={product} addToast={addToast} compact />
                  </div>
                ))}
              </div>
              <div className="mt-8 text-center">
                <Link to="/collections?filter=best" className="inline-flex items-center gap-1.5 text-xs font-semibold text-gold-600 hover:text-gold-500 transition-colors uppercase tracking-widest">
                  View All Products <ArrowRight size={12} />
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      <div className="section-divider" />

      {/* ════════════════════════════════════════════
          4 · COLLECTION SHOWCASE (Bento Grid)
      ════════════════════════════════════════════ */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-10 space-y-1">
            <span className="section-kicker block">Curated for You</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-ink-900">Explore Collections</h2>
            <div className="h-px w-14 bg-gold-400 mx-auto mt-3" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 auto-rows-[140px] sm:auto-rows-[160px] md:auto-rows-[190px]">
            {collections.map((col, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.07 }}
                className={col.span}
              >
                <Link
                  to={col.path}
                  className="group relative w-full h-full rounded-2xl overflow-hidden block"
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                    style={{ backgroundImage: `url('${col.image}')` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent md:hidden" />
                  <div className="absolute bottom-0 inset-x-0 p-4 sm:p-5 text-white">
                    <h3 className="font-serif text-base sm:text-xl md:text-2xl font-semibold leading-tight mb-0.5">
                      {col.name}
                    </h3>
                    <p className="text-[10px] sm:text-xs text-white/75 font-sans font-light mb-2 hidden sm:block">
                      {col.desc}
                    </p>
                    <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-semibold text-gold-300 uppercase tracking-wider group-hover:gap-2 transition-all duration-300">
                      Shop Now <ArrowRight size={10} />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}

            {/* Extra: Bespoke CTA */}
            <div className="flex col-span-2 row-span-1 rounded-2xl border border-white/10 p-3.5 sm:p-5 flex-col justify-between overflow-hidden relative shadow-sm hover:shadow-md transition-all duration-300 bg-cover bg-center"
              style={{ backgroundImage: "linear-gradient(to right, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.6) 60%, rgba(0,0,0,0.2) 100%), url('https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&auto=format&fit=crop&q=80')" }}
            >
              <div className="relative z-10">
                <span className="text-[8px] sm:text-[9px] text-emerald-400 font-bold tracking-[0.22em] uppercase font-sans">Karigar Studio</span>
                <h3 className="font-serif text-base sm:text-xl font-bold text-white mt-0.5 sm:mt-1 leading-tight">Bespoke Design Studio</h3>
                <p className="text-[10px] sm:text-xs text-white/80 font-light mt-0.5 sm:mt-1 max-w-[200px] sm:max-w-xs leading-normal sm:leading-relaxed">Co-create your dream jewellery with our master artisans. Custom 3D renders & live previews.</p>
              </div>
              <a
                href="https://wa.me/919876543210?text=Hi!%20I%20want%20to%20consult%20about%20a%20custom%20jewellery%20design."
                target="_blank"
                rel="noopener noreferrer"
                className="relative z-10 inline-flex items-center gap-2 mt-2.5 bg-[#25D366] hover:bg-[#20bc5a] text-white py-1.5 px-3.5 rounded-full text-[9px] sm:text-[10px] font-semibold tracking-wide transition-all duration-300 w-fit font-sans"
              >
                <svg viewBox="0 0 32 32" width="11" height="11" fill="currentColor">
                  <path d="M16.004 2.667C8.64 2.667 2.667 8.64 2.667 16c0 2.347.635 4.64 1.84 6.653L2.667 29.333l6.88-1.8A13.267 13.267 0 0 0 16.004 29.333c7.36 0 13.329-5.973 13.329-13.333S23.364 2.667 16.004 2.667zm0 24a10.613 10.613 0 0 1-5.413-1.48l-.387-.227-4.08 1.067 1.093-3.973-.253-.413A10.587 10.587 0 0 1 5.333 16c0-5.88 4.787-10.667 10.667-10.667S26.667 10.12 26.667 16 21.88 26.667 16 26.667zm5.84-7.973c-.32-.16-1.893-.933-2.187-1.04-.293-.107-.506-.16-.72.16-.213.32-.827 1.04-1.013 1.253-.187.213-.373.24-.693.08-.32-.16-1.347-.493-2.56-1.573-.947-.84-1.587-1.88-1.773-2.2-.187-.32-.02-.493.14-.653.144-.144.32-.373.48-.56.16-.187.213-.32.32-.533.107-.213.053-.4-.027-.56-.08-.16-.72-1.733-.987-2.373-.26-.627-.52-.533-.72-.547-.187-.013-.4-.013-.613-.013-.213 0-.56.08-.853.4-.293.32-1.12 1.093-1.12 2.667s1.147 3.093 1.307 3.307c.16.213 2.253 3.44 5.467 4.827.763.333 1.36.533 1.827.68.767.24 1.467.207 2.013.127.613-.093 1.893-.773 2.16-1.52.267-.747.267-1.387.187-1.52-.08-.133-.293-.213-.613-.373z"/>
                </svg>
                Chat on WhatsApp
              </a>
            </div>

            {/* Gift card */}
            <div className="flex col-span-1 row-span-1 rounded-2xl flex-col justify-between overflow-hidden relative border border-white/10 p-3 sm:p-4 shadow-sm hover:shadow-md transition-all duration-300 bg-cover bg-center"
              style={{ backgroundImage: "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.55) 60%, rgba(0,0,0,0.3) 100%), url('https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&auto=format&fit=crop&q=80')" }}
            >
              <div className="flex flex-col h-full relative z-10 justify-between">
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <div className="w-5 h-5 rounded-full bg-white/20 border border-white/25 flex items-center justify-center">
                      <Gift size={10} className="text-white" />
                    </div>
                    <span className="text-[7.5px] sm:text-[9px] text-rose-300 font-bold uppercase tracking-[0.18em] font-sans">Gift Ideas</span>
                  </div>
                  <h3 className="font-serif text-[11px] sm:text-sm font-bold text-white leading-tight">Send a Precious Gift</h3>
                  <p className="text-[7.5px] sm:text-[9px] text-white/75 font-light leading-snug mt-0.5 font-sans line-clamp-2">Gift-wrapped jewellery, delivered with love to your special someone.</p>
                </div>
                <Link to="/collections" className="inline-flex items-center gap-1 bg-rose-600 hover:bg-rose-500 text-white py-1 px-2.5 rounded-lg text-[8px] sm:text-[9px] uppercase tracking-wider font-bold transition-colors font-sans w-fit mt-1.5">
                  <Gift size={9} /> Shop Gifts <ArrowRight size={8} />
                </Link>
              </div>
            </div>

            {/* Location card */}
            <a 
              href="https://maps.google.com/?q=Srushti+Jewellery+Sangamner"
              target="_blank"
              rel="noopener noreferrer"
              className="flex col-span-1 row-span-1 rounded-2xl flex-col justify-between overflow-hidden relative border border-white/10 p-3 sm:p-4 shadow-sm hover:shadow-md transition-all duration-300 group bg-cover bg-center"
              style={{ backgroundImage: "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.55) 60%, rgba(0,0,0,0.3) 100%), url('https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=600&auto=format&fit=crop&q=80')" }}
            >
              <div className="p-0 flex flex-col h-full relative z-10 justify-between">
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <div className="w-5 h-5 rounded-full bg-white/20 border border-white/25 flex items-center justify-center">
                      <MapPin size={10} className="text-white" />
                    </div>
                    <span className="text-[7.5px] sm:text-[9px] text-gold-300 font-bold uppercase tracking-[0.18em] font-sans">Our Boutique</span>
                  </div>
                  <h3 className="font-serif text-[11px] sm:text-sm font-bold text-white leading-tight">Srushti Showroom</h3>
                  <p className="text-[7.5px] sm:text-[9px] text-white/75 font-light leading-snug mt-0.5 font-sans line-clamp-1">
                    Sangamner, Maharashtra.
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 bg-gold-500 hover:bg-gold-400 text-white py-1 px-2.5 rounded-lg text-[8px] sm:text-[9px] uppercase tracking-wider font-bold transition-colors font-sans w-fit mt-1.5">
                  <MapPin size={9} /> Location <ArrowRight size={8} className="group-hover:translate-x-0.5 transition-transform" />
                </span>
              </div>
            </a>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ════════════════════════════════════════════
          5 · TRENDING NOW
      ════════════════════════════════════════════ */}
      <section className="py-12 sm:py-16 bg-ivory-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-10 space-y-1">
            <span className="section-kicker block">What's Hot</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-ink-900">Trending Now</h2>
            <div className="h-px w-14 bg-gold-400 mx-auto mt-3" />
          </div>

          {loading ? (
            <ProductGridSkeleton count={5} />
          ) : (
            <>
              <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-4">
                {trendingProducts.map((product) => (
                  <div key={product.id}>
                    <ProductCard product={product} addToast={addToast} compact />
                  </div>
                ))}
              </div>
              <div className="mt-8 text-center">
                <Link to="/collections" className="inline-flex items-center gap-1.5 text-xs font-semibold text-gold-600 hover:text-gold-500 transition-colors uppercase tracking-widest">
                  View All Collections <ArrowRight size={12} />
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      <div className="section-divider" />

      {/* ════════════════════════════════════════════
          6 · CINEMATIC VIDEO SHOWCASES
      ════════════════════════════════════════════ */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-10 space-y-1">
            <span className="section-kicker block">In Motion</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-ink-900">Srushti Showcases</h2>
            <div className="h-px w-14 bg-gold-400 mx-auto mt-3" />
          </div>

          <div className="relative w-full max-w-[300px] sm:max-w-md mx-auto flex items-center justify-center py-4" style={{ minHeight: "440px" }}>
            {showcases.map((item, idx) => {
              const isActiveV = idx === activeVideoIdx;
              const prevIdx = (activeVideoIdx - 1 + showcases.length) % showcases.length;
              const nextIdx = (activeVideoIdx + 1) % showcases.length;

              let cardClass = "";
              if (isActiveV)       cardClass = "relative z-30 scale-100 opacity-100 translate-x-0 pointer-events-auto shadow-2xl border-gold-300/40";
              else if (idx === prevIdx) cardClass = "absolute z-10 scale-[0.8] opacity-30 -translate-x-[48%] pointer-events-none";
              else if (idx === nextIdx) cardClass = "absolute z-10 scale-[0.8] opacity-30  translate-x-[48%] pointer-events-none";
              else                  cardClass = "absolute z-0 scale-50 opacity-0 pointer-events-none hidden";

              return (
                <div
                  key={idx}
                  className={`w-[220px] sm:w-[240px] aspect-[9/16] rounded-2xl overflow-hidden border bg-ink-950 transition-all duration-500 ease-in-out ${cardClass}`}
                >
                  <video
                    ref={(el) => (videoRefs.current[idx] = el)}
                    src={item.video}
                    poster={item.poster}
                    loop muted={isMuted} playsInline
                    className="absolute inset-0 w-full h-full object-cover z-0"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 z-10" />

                  {isActiveV && (
                    <>
                      {/* Top controls */}
                      <div className="absolute top-3 inset-x-3 flex items-center justify-between z-20">
                        <span className="text-[10px] font-medium text-white/90 font-sans truncate max-w-[110px]">{item.title}</span>
                        <div className="flex items-center gap-1.5 text-white/80">
                          <button onClick={(e) => { e.preventDefault(); setIsMuted(!isMuted); }} className="hover:text-gold-300 p-0.5 transition-colors cursor-pointer" aria-label="Mute">
                            {isMuted ? <VolumeX size={13} /> : <Volume2 size={13} />}
                          </button>
                          <button onClick={(e) => handleShare(idx, e)} className="hover:text-gold-300 p-0.5 transition-colors cursor-pointer" aria-label="Share">
                            <Share2 size={13} />
                          </button>
                          <button onClick={(e) => handleFullscreen(idx, e)} className="hover:text-gold-300 p-0.5 transition-colors cursor-pointer" aria-label="Fullscreen">
                            <Maximize2 size={13} />
                          </button>
                        </div>
                      </div>

                      {/* Unmute CTA */}
                      {isMuted && (
                        <button
                          onClick={(e) => { e.preventDefault(); setIsMuted(false); }}
                          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/60 border border-white/20 hover:bg-gold-500 text-white rounded-lg px-3 py-1.5 text-[9px] uppercase tracking-wider font-bold backdrop-blur-sm z-20 flex items-center gap-1.5 cursor-pointer animate-pulse"
                        >
                          <Volume2 size={10} /> Tap to Unmute
                        </button>
                      )}

                      {/* Product banner */}
                      <div className="absolute bottom-7 inset-x-3 bg-black/70 backdrop-blur-md border border-white/10 rounded-xl p-2 flex items-center justify-between gap-2 z-20">
                        <div className="flex items-center gap-2 min-w-0">
                          <img src={item.productImg} alt={item.productName} className="w-9 h-9 rounded-lg object-cover border border-white/10 shrink-0" />
                          <div className="min-w-0">
                            <h4 className="text-[10px] font-bold text-white font-sans truncate">{item.productName}</h4>
                            <span className="text-[9px] text-gold-300 font-medium font-sans">{item.productPrice}</span>
                          </div>
                        </div>
                        <Link to={`/product/${item.productId}`} className="bg-gold-500 hover:bg-gold-400 text-white rounded-full p-1.5 transition-all flex items-center justify-center shrink-0">
                          <ArrowRight size={10} />
                        </Link>
                      </div>

                      {/* Progress bars */}
                      <div className="absolute bottom-3 inset-x-4 flex gap-1 z-20">
                        {showcases.map((_, di) => (
                          <div key={di} className={`h-[2px] rounded-full flex-grow transition-all duration-500 ${di === activeVideoIdx ? "bg-gold-400" : "bg-white/25"}`} />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              );
            })}

            {/* Arrows */}
            <button
              onClick={() => setActiveVideoIdx((p) => (p - 1 + showcases.length) % showcases.length)}
              className="absolute left-[-12px] sm:left-[-40px] z-40 bg-white border border-black/08 hover:bg-gold-500 hover:text-white hover:border-gold-500 text-ink-700 rounded-full p-2.5 transition-all duration-300 cursor-pointer shadow-md"
              aria-label="Previous"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => setActiveVideoIdx((p) => (p + 1) % showcases.length)}
              className="absolute right-[-12px] sm:right-[-40px] z-40 bg-white border border-black/08 hover:bg-gold-500 hover:text-white hover:border-gold-500 text-ink-700 rounded-full p-2.5 transition-all duration-300 cursor-pointer shadow-md"
              aria-label="Next"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ════════════════════════════════════════════
          7 · TRUST CENTER
      ════════════════════════════════════════════ */}
      <section className="py-12 sm:py-16 bg-ink-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-10 space-y-1">
            <span className="text-gold-400 text-[10px] font-semibold tracking-[0.2em] uppercase block font-sans">Our Promise</span>
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-white">Quality You Can Trust</h2>
            <div className="h-px w-12 bg-gold-500 mx-auto mt-3" />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
            {trustItems.map((t, i) => (
              <div key={i} className="bg-white/[0.04] border border-white/[0.07] rounded-2xl p-5 sm:p-6 flex flex-col items-center text-center gap-3 hover:bg-white/[0.07] transition-colors">
                <div className="w-12 h-12 rounded-full bg-gold-500/10 border border-gold-500/20 flex items-center justify-center">
                  {t.icon}
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-gold-200 uppercase tracking-wider font-sans">{t.title}</h3>
                <p className="text-[10px] sm:text-xs text-white/40 font-light leading-relaxed font-sans">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ════════════════════════════════════════════
          8 · TESTIMONIALS
      ════════════════════════════════════════════ */}
      {reviews.length > 0 && (
        <section className="py-12 sm:py-16 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
            <div className="mb-8 space-y-1">
              <span className="section-kicker block">Patron Stories</span>
              <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-ink-900">What Our Clients Say</h2>
              <div className="h-px w-12 bg-gold-400 mx-auto mt-3" />
            </div>

            <div className="relative min-h-[160px] flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentReviewIdx}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-5"
                >
                  <Heart className="text-gold-400 mx-auto w-7 h-7" />
                  <p className="font-serif italic text-sm sm:text-lg text-ink-700 font-light leading-relaxed max-w-xl mx-auto">
                    "{reviews[currentReviewIdx].comment}"
                  </p>
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex gap-0.5 text-amber-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} size={12} className={i < reviews[currentReviewIdx].rating ? "fill-amber-400" : "text-ink-200"} />
                      ))}
                    </div>
                    <div className="flex items-center gap-2.5">
                      <img
                        src={reviews[currentReviewIdx].avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"}
                        alt={reviews[currentReviewIdx].userName}
                        className="w-8 h-8 rounded-full object-cover border-2 border-gold-200"
                      />
                      <div className="text-left">
                        <h4 className="font-serif font-semibold text-sm text-ink-900 leading-none">{reviews[currentReviewIdx].userName}</h4>
                        <span className="text-[9px] uppercase tracking-widest text-ink-400 block mt-0.5">
                          Verified Patron &bull; {reviews[currentReviewIdx].productName}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="flex justify-center gap-2 mt-5">
              {reviews.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentReviewIdx(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${i === currentReviewIdx ? "bg-gold-500 w-6" : "bg-ink-200 w-1.5 hover:bg-ink-300"}`}
                  aria-label={`Review ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </section>
      )}

    </div>
  );
};
