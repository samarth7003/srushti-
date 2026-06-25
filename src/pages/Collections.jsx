import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { getProducts, getCategories } from "../services/db";
import { ProductCard } from "../components/ProductCard";
import { ProductGridSkeleton } from "../components/LoadingSkeleton";
import { useCart } from "../context/CartContext";
import { Search, RefreshCw, ChevronLeft, ChevronRight } from "lucide-react";

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
    <div className="bg-gold-50/20 dark:bg-luxury-black transition-colors duration-300 font-sans min-h-screen py-10 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="text-left mb-8 space-y-2">
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-luxury-black dark:text-gold-200 leading-tight">
            {selectedCategory === "Wishlist" ? "Your Wishlist" : "Exclusive Showroom Catalog"}
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-light max-w-xl">
            {selectedCategory === "Wishlist"
              ? "Your curated collection of premium Srushti pieces, saved for your viewing."
              : "Discover handcrafted pieces blending traditional artistry and modern sophistication."}
          </p>
        </div>

        {/* Catalog Main Layout */}
        <div className="space-y-6">
          {/* Horizontal Filters (Navbar Style, Less Space) */}
          <div className="bg-white dark:bg-luxury-charcoal p-4 rounded-3xl border border-gold-100/50 dark:border-stone-850/40 shadow-sm space-y-4">
            {/* Row 1: Category Scrollable Pills (Horizontal Navbar) */}
            <div className="overflow-x-auto flex gap-2 pb-2 border-b border-gold-100/10 dark:border-stone-850/20 select-none scrollbar-thin">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setCurrentPage(1);
                  }}
                  className={`text-[11px] px-4 py-2 rounded-xl border whitespace-nowrap transition-all duration-300 cursor-pointer font-bold tracking-wide uppercase ${
                    selectedCategory === cat
                      ? "bg-gold-500 text-stone-950 border-gold-500 shadow-sm"
                      : "border-gray-200/50 dark:border-stone-800 text-gray-600 dark:text-gray-400 hover:border-gold-400 hover:text-gold-500"
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
                  className="w-full bg-stone-50 dark:bg-stone-900 border border-gold-100/60 dark:border-stone-850/40 text-xs rounded-xl py-2.5 pl-4 pr-10 focus:outline-none focus:border-gold-500 font-light text-luxury-black dark:text-white"
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
                  className={`px-3 py-2 rounded-xl border transition-all duration-300 cursor-pointer font-semibold uppercase tracking-wider text-[10px] ${
                    sortBy === "bestseller"
                      ? "bg-gold-500 text-stone-950 border-gold-500 font-bold"
                      : "border-gold-200/50 dark:border-stone-850 text-gray-600 dark:text-stone-300 hover:border-gold-400"
                  }`}
                >
                  🔥 Best Sellers
                </button>

                {/* Quick Toggle: New Arrivals */}
                <button
                  type="button"
                  onClick={() => {
                    setSortBy(sortBy === "newest" ? "default" : "newest");
                    setCurrentPage(1);
                  }}
                  className={`px-3 py-2 rounded-xl border transition-all duration-300 cursor-pointer font-semibold uppercase tracking-wider text-[10px] ${
                    sortBy === "newest"
                      ? "bg-gold-500 text-stone-950 border-gold-500 font-bold"
                      : "border-gold-200/50 dark:border-stone-850 text-gray-600 dark:text-stone-300 hover:border-gold-400"
                  }`}
                >
                  🆕 New Arrivals
                </button>

                {/* Material Select */}
                <div className="flex items-center gap-1.5 bg-stone-50 dark:bg-stone-900 border border-gold-100/60 dark:border-stone-850/40 px-3 py-2 rounded-xl text-gray-600 dark:text-stone-300">
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
                <div className="flex items-center gap-2 bg-stone-50 dark:bg-stone-900 border border-gold-100/60 dark:border-stone-850/40 px-3 py-2 rounded-xl text-gray-600 dark:text-stone-300">
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
                <div className="flex items-center gap-1.5 bg-stone-50 dark:bg-stone-900 border border-gold-100/60 dark:border-stone-850/40 px-3 py-2 rounded-xl text-gray-600 dark:text-stone-300">
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
                <div className="flex items-center gap-1.5 bg-stone-50 dark:bg-stone-900 border border-gold-100/60 dark:border-stone-850/40 px-3 py-2 rounded-xl text-gray-600 dark:text-stone-300">
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
                  className="bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-750 text-luxury-black dark:text-stone-300 p-2.5 rounded-xl transition-all duration-300 cursor-pointer"
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
              <div className="bg-white dark:bg-luxury-charcoal py-20 px-6 rounded-3xl border border-gold-100/40 text-center space-y-4">
                <span className="text-4xl">💎</span>
                <h3 className="font-serif text-2xl font-bold text-luxury-black dark:text-white">
                  No Masterpieces Found
                </h3>
                <p className="text-sm text-gray-500 max-w-sm mx-auto font-light leading-relaxed">
                  We couldn't find matching jewellery items for your current search or filter. Try resetting filters to explore Srushti collections.
                </p>
                <button
                  onClick={resetFilters}
                  className="bg-gold-500 hover:bg-gold-600 text-stone-950 px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wide transition-all cursor-pointer"
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
                  <div className="flex items-center justify-center space-x-2 pt-10 border-t border-gold-100/10 dark:border-stone-850/20">
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
