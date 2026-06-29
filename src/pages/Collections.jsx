import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { getProducts, getCategories } from "../services/db";
import { ProductCard } from "../components/ProductCard";
import { ProductGridSkeleton } from "../components/LoadingSkeleton";
import { useCart } from "../context/CartContext";
import { Search, RefreshCw, ChevronLeft, ChevronRight, Flame, Sparkles, SlidersHorizontal, X } from "lucide-react";

export const Collections = ({ addToast }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const { wishlist } = useCart();

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedMaterial, setSelectedMaterial] = useState("All");
  const [selectedStock, setSelectedStock] = useState("All");
  const [priceRange, setPriceRange] = useState(500000);
  const [sortBy, setSortBy] = useState("default");
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // Shows 8 items (fits a 4-column layout perfectly!)

  // Materials list
  const materialsList = ["All", "22K Gold", "18K Gold", "Diamond & Platinum", "Rose Gold", "18K Gold & Diamonds"];

  // Fetch Products & Categories
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const dbProducts = await getProducts();
        const dbCategories = await getCategories();
        setProducts(dbProducts);
        setCategories(["All", ...dbCategories]);
      } catch (err) {
        console.error("Error loading products", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Sync URL search parameters
  useEffect(() => {
    const urlCategory = searchParams.get("category");
    const urlSearch = searchParams.get("search");
    const urlFilter = searchParams.get("filter");
    const urlPriceMax = searchParams.get("priceMax");
    const urlMaterial = searchParams.get("material");

    if (urlCategory) setSelectedCategory(urlCategory);
    if (urlSearch) setSearchQuery(urlSearch);
    if (urlMaterial) setSelectedMaterial(urlMaterial);
    if (urlPriceMax) {
      const parsedPrice = parseInt(urlPriceMax, 10);
      if (!isNaN(parsedPrice)) {
        setPriceRange(parsedPrice);
      }
    }
    if (urlFilter) {
      if (urlFilter === "new") {
        setSortBy("newest");
      } else if (urlFilter === "best") {
        setSortBy("bestseller");
      } else if (urlFilter === "wishlist") {
        setSelectedCategory("Wishlist");
      }
    }
  }, [searchParams]);

  // Filter & Sort Logic
  const getFilteredProducts = () => {
    let list = [...products];

    // Special Wishlist filter
    if (selectedCategory === "Wishlist") {
      return list.filter((p) => wishlist.some((item) => item.id === p.id));
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (selectedCategory !== "All") {
      list = list.filter((p) => p.category === selectedCategory);
    }

    // Material filter
    if (selectedMaterial !== "All") {
      list = list.filter((p) => p.material === selectedMaterial);
    }

    // Stock availability filter
    if (selectedStock === "in-stock") {
      list = list.filter((p) => p.stock > 0);
    } else if (selectedStock === "out-of-stock") {
      list = list.filter((p) => p.stock === 0);
    }

    // Max Price filter
    list = list.filter((p) => p.price <= priceRange);

    // Sorting logic
    if (sortBy === "price-low-to-high") {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high-to-low") {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      list.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "newest") {
      list.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    } else if (sortBy === "bestseller") {
      list.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0));
    }

    return list;
  };

  const filteredProducts = getFilteredProducts();

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setSelectedMaterial("All");
    setSelectedStock("All");
    setPriceRange(500000);
    setSortBy("default");
    setSearchParams({});
    setCurrentPage(1);
  };

  // Pagination Math
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="page-band transition-colors duration-300 font-sans min-h-screen py-10 sm:py-14 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="text-left mb-8 sm:mb-10 space-y-3 animate-slide-up">
          <span className="section-kicker">Srushti showroom catalog</span>
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-semibold text-luxury-black dark:text-gold-100 leading-tight">
            {selectedCategory === "Wishlist" ? "Your Wishlist" : "Exclusive Showroom Catalog"}
          </h1>
          <p className="text-sm text-stone-600 dark:text-stone-400 font-light max-w-2xl leading-relaxed">
            {selectedCategory === "Wishlist"
              ? "Your curated collection of premium Srushti pieces, saved for your viewing."
              : "Discover handcrafted pieces blending traditional artistry and modern sophistication."}
          </p>
        </div>

        {/* Catalog Main Layout */}
        <div className="space-y-4 sm:space-y-6">
          {/* Mobile Filters Section (lg:hidden) */}
          <div className="lg:hidden space-y-2 w-full animate-fade-in">
            {/* Search Input (100% width) */}
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search catalog..."
                className="w-full bg-white dark:bg-stone-900 border border-black/10 dark:border-white/10 rounded-full py-1.5 pl-4 pr-10 text-[10.5px] focus:outline-none focus:border-gold-500 text-luxury-black dark:text-white"
              />
              <Search size={11} className="absolute right-3.5 top-2.5 text-gray-400" />
            </div>

            {/* Scrollable Category pills row */}
            <div className="overflow-x-auto flex gap-1 pb-0.5 select-none scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setCurrentPage(1);
                  }}
                  className={`text-[8px] px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full border whitespace-nowrap transition-all duration-300 cursor-pointer font-bold tracking-wide uppercase ${
                    selectedCategory === cat
                      ? "bg-gold-500 text-stone-950 border-gold-500 shadow-sm"
                      : "bg-white dark:bg-stone-900/60 border-black/05 dark:border-white/10 text-ink-600 dark:text-stone-300 hover:border-gold-400 hover:text-gold-600"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Scrollable Advanced Filters row */}
            <div className="overflow-x-auto flex gap-1 pb-1.5 select-none scrollbar-none text-[8.5px]">
              {/* Metal Select Dropdown */}
              <div className="bg-white dark:bg-stone-900 border border-black/05 dark:border-white/10 rounded-full px-2 py-0.5 flex items-center text-ink-900 dark:text-stone-200 shrink-0 font-bold uppercase tracking-wider">
                <select
                  value={selectedMaterial}
                  onChange={(e) => {
                    setSelectedMaterial(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="bg-transparent text-ink-900 dark:text-stone-200 focus:outline-none cursor-pointer outline-none text-[8.5px] py-0.5 font-bold pr-3.5"
                >
                  {materialsList.map((mat) => (
                    <option key={mat} value={mat} className="bg-white text-ink-900 dark:bg-stone-900 dark:text-stone-100">
                      {mat === "All" ? "Metal: All" : mat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Slider Input */}
              <div className="bg-white dark:bg-stone-900 border border-black/05 dark:border-white/10 rounded-full px-2 py-0.5 flex items-center gap-1 text-ink-900 dark:text-stone-200 shrink-0 font-bold uppercase tracking-wider">
                <span>Max: ₹{(priceRange / 1000).toFixed(0)}K</span>
                <input
                  type="range"
                  min="20000"
                  max="500000"
                  step="10000"
                  value={priceRange}
                  onChange={(e) => {
                    setPriceRange(parseInt(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="w-10 accent-gold-500 bg-gray-200 dark:bg-stone-850 rounded-lg cursor-pointer h-0.5"
                />
              </div>

              {/* Stock Select Dropdown */}
              <div className="bg-white dark:bg-stone-900 border border-black/05 dark:border-white/10 rounded-full px-2 py-0.5 flex items-center text-ink-900 dark:text-stone-200 shrink-0 font-bold uppercase tracking-wider">
                <select
                  value={selectedStock}
                  onChange={(e) => {
                    setSelectedStock(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="bg-transparent text-ink-900 dark:text-stone-200 focus:outline-none cursor-pointer outline-none text-[8.5px] py-0.5 font-bold pr-3.5"
                >
                  <option value="All" className="bg-white text-ink-900 dark:bg-stone-900 dark:text-stone-100">Stock: All</option>
                  <option value="in-stock" className="bg-white text-ink-900 dark:bg-stone-900 dark:text-stone-100">In Stock</option>
                  <option value="out-of-stock" className="bg-white text-ink-900 dark:bg-stone-900 dark:text-stone-100">Out of Stock</option>
                </select>
              </div>

              {/* Sort By Select Dropdown */}
              <div className="bg-white dark:bg-stone-900 border border-black/05 dark:border-white/10 rounded-full px-2 py-0.5 flex items-center text-ink-900 dark:text-stone-200 shrink-0 font-bold uppercase tracking-wider">
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="bg-transparent text-ink-900 dark:text-stone-200 focus:outline-none cursor-pointer outline-none text-[8.5px] py-0.5 font-bold pr-3.5"
                >
                  <option value="default" className="bg-white text-ink-900 dark:bg-stone-900 dark:text-stone-100">Sort: Default</option>
                  <option value="price-low-to-high" className="bg-white text-ink-900 dark:bg-stone-900 dark:text-stone-100">Price: L-to-H</option>
                  <option value="price-high-to-low" className="bg-white text-ink-900 dark:bg-stone-900 dark:text-stone-100">Price: H-to-L</option>
                  <option value="rating" className="bg-white text-ink-900 dark:bg-stone-900 dark:text-stone-100">Top Rated</option>
                  <option value="newest" className="bg-white text-ink-900 dark:bg-stone-900 dark:text-stone-100">Newest</option>
                  <option value="bestseller" className="bg-white text-ink-900 dark:bg-stone-900 dark:text-stone-100">Bestseller</option>
                </select>
              </div>

              {/* Reset Filters Icon Button */}
              <button
                onClick={resetFilters}
                className="bg-white hover:bg-gold-100 dark:bg-stone-850 dark:hover:bg-stone-800 text-luxury-black dark:text-stone-300 px-2 py-0.5 rounded-full transition-all duration-300 cursor-pointer border border-black/05 dark:border-white/10 shrink-0 flex items-center justify-center"
                title="Reset Filters"
              >
                <RefreshCw size={9} />
              </button>
            </div>
          </div>

          {/* Desktop Horizontal Filters (hidden on mobile, lg:block) */}
          <div className="hidden lg:block surface-luxury p-4 sm:p-5 rounded-2xl space-y-4 animate-fade-in">
             {/* Row 1: Category Scrollable Pills (Horizontal Navbar) */}
             <div className="overflow-x-auto flex gap-2 pb-3 border-b border-gold-200/35 dark:border-stone-800/40 select-none scrollbar-thin">
               {categories.map((cat) => (
                 <button
                   key={cat}
                   onClick={() => {
                     setSelectedCategory(cat);
                     setCurrentPage(1);
                   }}
                   className={`text-[11px] px-4 py-2 rounded-full border whitespace-nowrap transition-all duration-300 cursor-pointer font-bold tracking-wide uppercase ${
                     selectedCategory === cat
                       ? "bg-gold-500 text-stone-950 border-gold-500 shadow-sm"
                       : "bg-white dark:bg-stone-900/60 border-black/08 dark:border-white/10 text-ink-600 dark:text-stone-300 hover:border-gold-400 hover:text-gold-600 hover:bg-gold-50/20"
                   }`}
                 >
                   {cat}
                 </button>
               ))}
             </div>

             {/* Row 2: Filters Dropdown Row & Search */}
             <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
               {/* Search input in catalog */}
               <div className="relative w-full lg:max-w-md">
                 <input
                   type="text"
                   value={searchQuery}
                   onChange={(e) => {
                     setSearchQuery(e.target.value);
                     setCurrentPage(1);
                   }}
                   placeholder="Search catalog by name or description..."
                   className="w-full catalog-control text-xs py-3 pl-4 pr-10 focus:outline-none font-light text-luxury-black dark:text-white bg-white dark:bg-stone-900"
                 />
                 <Search size={14} className="absolute right-3.5 top-3.5 text-gray-400" />
               </div>

               {/* Advanced Filter Dropdowns */}
               <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto justify-start lg:justify-end text-xs">
                 {/* Quick Toggle: Best Sellers */}
                 <button
                   type="button"
                   onClick={() => {
                     setSortBy(sortBy === "bestseller" ? "default" : "bestseller");
                     setCurrentPage(1);
                   }}
                   className={`px-3 py-2 rounded-full border transition-all duration-300 cursor-pointer font-semibold uppercase tracking-wider text-[10px] inline-flex items-center gap-1.5 ${
                     sortBy === "bestseller"
                       ? "bg-gold-500 text-stone-950 border-gold-500 font-bold"
                       : "bg-white dark:bg-stone-900/60 border-black/08 dark:border-white/10 text-ink-600 dark:text-stone-300 hover:border-gold-400 hover:text-gold-600 hover:bg-gold-50/20"
                   }`}
                 >
                   <Flame size={12} />
                   Best Sellers
                 </button>

                 {/* Quick Toggle: New Arrivals */}
                 <button
                   type="button"
                   onClick={() => {
                     setSortBy(sortBy === "newest" ? "default" : "newest");
                     setCurrentPage(1);
                   }}
                   className={`px-3 py-2 rounded-full border transition-all duration-300 cursor-pointer font-semibold uppercase tracking-wider text-[10px] inline-flex items-center gap-1.5 ${
                     sortBy === "newest"
                       ? "bg-gold-500 text-stone-950 border-gold-500 font-bold"
                       : "bg-white dark:bg-stone-900/60 border-black/08 dark:border-white/10 text-ink-600 dark:text-stone-300 hover:border-gold-400 hover:text-gold-600 hover:bg-gold-50/20"
                   }`}
                 >
                   <Sparkles size={12} />
                   New Arrivals
                 </button>

                {/* Material Select */}
                <div className="catalog-control flex items-center gap-1.5 px-3 py-2 text-gray-600 dark:text-stone-300">
                  <span className="text-gray-400">Metal:</span>
                  <select
                    value={selectedMaterial}
                    onChange={(e) => {
                      setSelectedMaterial(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="bg-transparent focus:outline-none font-medium cursor-pointer"
                  >
                    {materialsList.map((mat) => (
                      <option key={mat} value={mat}>
                        {mat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Select Slider */}
                <div className="catalog-control flex items-center gap-2 px-3 py-2 text-gray-600 dark:text-stone-300">
                  <span className="text-gray-400">Max:</span>
                  <span className="font-bold text-gold-600 dark:text-gold-400">₹{(priceRange / 1000).toFixed(0)}K</span>
                  <input
                    type="range"
                    min="20000"
                    max="500000"
                    step="10000"
                    value={priceRange}
                    onChange={(e) => {
                      setPriceRange(parseInt(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="w-16 sm:w-20 accent-gold-500 bg-gray-200 dark:bg-stone-800 rounded-lg cursor-pointer h-1"
                  />
                </div>

                {/* Stock Select */}
                <div className="catalog-control flex items-center gap-1.5 px-3 py-2 text-gray-600 dark:text-stone-300">
                  <span className="text-gray-400">Stock:</span>
                  <select
                    value={selectedStock}
                    onChange={(e) => {
                      setSelectedStock(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="bg-transparent focus:outline-none font-medium cursor-pointer"
                  >
                    <option value="All">All</option>
                    <option value="in-stock">In Stock</option>
                    <option value="out-of-stock">Out of Stock</option>
                  </select>
                </div>

                {/* Sort By Select */}
                <div className="catalog-control flex items-center gap-1.5 px-3 py-2 text-gray-600 dark:text-stone-300">
                  <span className="text-gray-400">Sort:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => {
                      setSortBy(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="bg-transparent focus:outline-none font-medium cursor-pointer"
                  >
                    <option value="default">Relevance</option>
                    <option value="price-low-to-high">Price: Low to High</option>
                    <option value="price-high-to-low">Price: High to Low</option>
                    <option value="rating">Top Rated</option>
                    <option value="newest">Newest Arrivals</option>
                    <option value="bestseller">Best Sellers</option>
                  </select>
                </div>

                {/* Reset Filters Icon Button */}
                <button
                  onClick={resetFilters}
                  className="bg-white hover:bg-gold-100 dark:bg-stone-800 dark:hover:bg-stone-700 text-luxury-black dark:text-stone-300 p-2.5 rounded-full transition-all duration-300 cursor-pointer border border-gold-200/40"
                  title="Reset Filters"
                >
                  <RefreshCw size={12} />
                </button>
              </div>
            </div>
          </div>

          {/* Products List Grid */}
          <main className="space-y-6">
            {loading ? (
              <ProductGridSkeleton count={itemsPerPage} />
            ) : filteredProducts.length === 0 ? (
              <div className="surface-luxury py-20 px-6 rounded-2xl text-center space-y-4">
                <Sparkles size={42} className="mx-auto text-gold-500" />
                <h3 className="font-serif text-2xl font-bold text-luxury-black dark:text-white">
                  No Masterpieces Found
                </h3>
                <p className="text-sm text-gray-500 max-w-sm mx-auto font-light leading-relaxed">
                  We couldn't find matching jewellery items for your current search or filter. Try resetting filters to explore Srushti collections.
                </p>
                <button
                  onClick={resetFilters}
                  className="bg-gold-500 hover:bg-gold-600 text-stone-950 px-6 py-2.5 rounded-full font-bold text-xs uppercase tracking-wide transition-all cursor-pointer premium-btn"
                >
                  Show All Products
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                  {paginatedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} addToast={addToast} />
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center space-x-2 pt-10 border-t border-gold-200/25 dark:border-stone-800/35">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="p-2 border border-gold-200/50 dark:border-stone-800 hover:border-gold-500 rounded-lg text-gray-500 hover:text-gold-500 disabled:opacity-30 disabled:border-gold-200/20 transition-all cursor-pointer"
                    >
                      <ChevronLeft size={16} />
                    </button>

                    {Array.from({ length: totalPages }).map((_, idx) => {
                      const pageNum = idx + 1;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`w-9 h-9 rounded-lg font-semibold text-xs tracking-wider transition-all cursor-pointer ${
                            currentPage === pageNum
                              ? "bg-gold-500 text-stone-950"
                              : "border border-gold-200/50 dark:border-stone-800 text-gray-600 dark:text-gray-400 hover:border-gold-500 hover:text-gold-500"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="p-2 border border-gold-200/50 dark:border-stone-800 hover:border-gold-500 rounded-lg text-gray-500 hover:text-gold-500 disabled:opacity-30 disabled:border-gold-200/20 transition-all cursor-pointer"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};
