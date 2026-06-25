import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import {
  Search,
  Heart,
  ShoppingBag,
  Menu,
  X,
  Sun,
  Moon,
  User,
  ShieldCheck,
  LogOut
} from "lucide-react";
import { LogoIcon } from "./LogoIcon";

export const Navbar = () => {
  const { cartCount, wishlist } = useCart();
  const { isDark, toggleTheme } = useTheme();
  const { user, isAdmin, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/collections?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsMobileMenuOpen(false);
    }
  };

  const menuItems = [
    { label: "Home", path: "/" },
    { label: "Collections", path: "/collections" },
    { label: "About Us", path: "/about" },
    { label: "Reviews", path: "/reviews" },
    { label: "Contact Us", path: "/contact" }
  ];

  return (
    <nav className="sticky top-0 z-40 bg-white/90 dark:bg-luxury-black/90 backdrop-blur-md border-b border-gold-200/30 dark:border-gold-800/20 transition-colors duration-300 font-sans">
      {/* Announcement Bar & Live Gold Rate Ticker */}
      <div className="w-full bg-stone-950 dark:bg-stone-900 border-b border-gold-500/25 py-2 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Live Gold Rates */}
          <div className="flex items-center gap-2 text-[10px] sm:text-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-semibold text-gold-400 uppercase tracking-wider hidden xs:inline">Rate:</span>
            <span className="text-stone-300 font-medium font-sans">22K Gold <span className="font-bold text-white">₹7,250/g</span></span>
            <span className="text-stone-600">|</span>
            <span className="text-stone-300 font-medium font-sans">24K <span className="font-bold text-white">₹7,910/g</span></span>
            <span className="text-emerald-400 text-[9px] font-bold font-sans">▲ 0.15%</span>
          </div>

          {/* Quick Announcement */}
          <div className="hidden lg:block text-stone-300 font-light text-[11px] uppercase tracking-widest text-center flex-grow">
            ✨ Free Insured Shipping in India | 100% BIS Hallmarked Jewellery ✨
          </div>

          {/* Utility Actions & Theme Toggle */}
          <div className="flex items-center gap-4 text-xs font-medium">
            <Link to="/track-order" className="text-stone-400 hover:text-gold-400 transition-colors hidden sm:inline uppercase tracking-wider text-[10px]">
              Track Order
            </Link>
            <span className="text-stone-700 hidden sm:inline">|</span>
            <button
              onClick={toggleTheme}
              className="flex items-center justify-center p-1 text-stone-400 hover:text-gold-450 transition-all rounded-full hover:bg-stone-850 cursor-pointer"
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDark ? <Sun size={14} className="text-gold-400" /> : <Moon size={14} />}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden text-luxury-black dark:text-gold-100 hover:text-gold-500 transition-colors"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Brand Logo - Serif */}
        <Link to="/" className="flex items-center gap-2 select-none group">
          <LogoIcon className="w-8 h-8 text-gold-500 group-hover:scale-105 transition-transform" />
          <div className="flex flex-col items-center">
            <span className="font-serif text-xl sm:text-2xl font-bold tracking-widest text-luxury-black dark:text-gold-200 group-hover:text-gold-500 transition-colors leading-none">
              SRUSHTI
            </span>
            <span className="text-[8px] tracking-[0.3em] font-light text-gold-600 dark:text-gold-400 mt-0.5">
              JEWELLERY
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center space-x-8">
          {menuItems.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className="text-sm font-medium tracking-wide text-gray-700 dark:text-gray-300 hover:text-gold-600 dark:hover:text-gold-400 transition-colors relative group py-2"
            >
              {item.label}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gold-500 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          ))}
        </div>

        {/* Icons Utility Bar */}
        <div className="flex items-center space-x-4">
          {/* Search bar - Desktop */}
          <form onSubmit={handleSearchSubmit} className="hidden lg:flex items-center relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search jewellery..."
              className="bg-stone-50 dark:bg-stone-900 border border-gold-200/60 dark:border-stone-800 text-sm rounded-full py-1.5 pl-4 pr-10 focus:outline-none focus:border-gold-500 w-48 focus:w-64 transition-all duration-300 font-light"
            />
            <button
              type="submit"
              className="absolute right-3 text-gray-400 hover:text-gold-500 transition-colors"
            >
              <Search size={16} />
            </button>
          </form>

          {/* Wishlist Link */}
          <Link
            to="/collections?filter=wishlist"
            className="p-2 text-gray-700 dark:text-gray-300 hover:text-gold-500 transition-colors rounded-full relative"
            aria-label="Wishlist"
          >
            <Heart size={20} />
            {wishlist.length > 0 && (
              <span className="absolute top-0 right-0 w-4.5 h-4.5 bg-gold-500 text-stone-950 text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                {wishlist.length}
              </span>
            )}
          </Link>

          {/* Cart Link */}
          <Link
            to="/cart"
            className="p-2 text-gray-700 dark:text-gray-300 hover:text-gold-500 transition-colors rounded-full relative"
            aria-label="Shopping Cart"
          >
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 w-4.5 h-4.5 bg-gold-500 text-stone-950 text-[10px] font-bold rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          {/* User Account / Admin Dashboard / Login */}
          {isAdmin ? (
            <div className="flex items-center space-x-1 border border-gold-300/40 px-3 py-1 rounded-full bg-gold-50/30 dark:bg-stone-900/40">
              <Link
                to="/admin"
                className="text-xs font-semibold text-gold-600 dark:text-gold-400 hover:text-gold-500 transition-colors flex items-center gap-1"
                title="Admin Dashboard"
              >
                <ShieldCheck size={16} />
                <span className="hidden sm:inline">Admin</span>
              </Link>
              <button
                onClick={logout}
                className="text-gray-400 hover:text-red-500 p-1 transition-colors"
                title="Admin Logout"
              >
                <LogOut size={14} />
              </button>
            </div>
          ) : user ? (
            <div className="flex items-center space-x-1 border border-gold-300/40 px-3 py-1 rounded-full bg-gold-50/30 dark:bg-stone-900/40">
              <Link
                to="/account"
                className="text-xs font-semibold text-gold-600 dark:text-gold-400 hover:text-gold-500 transition-colors flex items-center gap-1"
                title="Your Account"
              >
                <User size={16} />
                <span className="hidden sm:inline truncate max-w-[80px]">{user.name}</span>
              </Link>
              <button
                onClick={logout}
                className="text-gray-400 hover:text-red-500 p-1 transition-colors"
                title="Logout"
              >
                <LogOut size={14} />
              </button>
            </div>
          ) : (
            <Link
              to="/account"
              className="p-2 text-gray-700 dark:text-gray-300 hover:text-gold-500 transition-colors rounded-full"
              title="Customer Login"
            >
              <User size={20} />
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-stone-950/80 animate-fade-in flex">
          <div className="w-4/5 max-w-sm bg-white dark:bg-luxury-black p-6 flex flex-col h-full border-r border-gold-800/20 shadow-2xl">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <span className="font-serif font-bold text-lg tracking-widest text-gold-500">
                SRUSHTI JEWELLERY
              </span>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-luxury-black dark:text-gray-300 p-1 hover:text-gold-500"
              >
                <X size={24} />
              </button>
            </div>

            {/* Mobile Search */}
            <form onSubmit={handleSearchSubmit} className="relative mb-6">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search jewellery..."
                className="w-full bg-stone-50 dark:bg-stone-900 border border-gold-200/50 rounded-full py-2 pl-4 pr-10 focus:outline-none focus:border-gold-500 text-sm font-light text-luxury-black dark:text-white"
              />
              <button type="submit" className="absolute right-3 top-2.5 text-gray-400 hover:text-gold-500">
                <Search size={16} />
              </button>
            </form>

            {/* Links Stack */}
            <div className="flex flex-col space-y-4">
              {menuItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-base font-medium text-gray-800 dark:text-gray-200 hover:text-gold-500 py-2 border-b border-stone-100 dark:border-stone-900"
                >
                  {item.label}
                </Link>
              ))}
              
              {/* User Account / Profile */}
              {user ? (
                <div className="flex flex-col space-y-2 border-b border-stone-100 dark:border-stone-900 py-2 text-left">
                  <span className="text-[10px] text-gray-400 font-light pl-2">Logged in as {user.name}</span>
                  <Link
                    to={user.role === "admin" ? "/admin" : "/account"}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-base font-medium text-gold-600 hover:text-gold-500 flex items-center gap-2"
                  >
                    {user.role === "admin" ? <ShieldCheck size={18} /> : <User size={18} />}
                    {user.role === "admin" ? "Admin Dashboard" : "My Profile Account"}
                  </Link>
                </div>
              ) : (
                <Link
                  to="/account"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-base font-medium text-gold-600 hover:text-gold-500 py-2 flex items-center gap-2 border-b border-stone-100 dark:border-stone-900 text-left"
                >
                  <User size={18} />
                  Login / Register
                </Link>
              )}
            </div>


            {/* Timings summary */}
            <div className="mt-auto pt-6 border-t border-stone-100 dark:border-stone-900 text-xs text-gray-400 space-y-2">
              <p className="font-serif text-stone-600 dark:text-stone-300 font-bold">Showroom Timings:</p>
              <p>Mon - Sat: 10:30 AM - 8:30 PM</p>
              <p>Sunday: 11:30 AM - 6:00 PM</p>
            </div>
          </div>
          {/* Backdrop click closer */}
          <div className="flex-1" onClick={() => setIsMobileMenuOpen(false)}></div>
        </div>
      )}
    </nav>
  );
};
