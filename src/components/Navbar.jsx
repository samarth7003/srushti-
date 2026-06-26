import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import {
  Search,
  Heart,
  ShoppingBag,
  Menu,
  X,
  User,
  ShieldCheck,
  LogOut
} from "lucide-react";
import { LogoIcon } from "./LogoIcon";

export const Navbar = () => {
  const { cartCount, wishlist } = useCart();
  const { user, isAdmin, logout } = useAuth();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const navigate = useNavigate();
  const { pathname: currentPath } = useLocation();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/collections?search=${encodeURIComponent(searchQuery.trim())}`);
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
    <>
      <nav className={`sticky top-0 ${isMobileMenuOpen ? "z-50" : "z-40"} bg-stone-950 md:bg-white/90 dark:bg-luxury-black/90 backdrop-blur-md border-b border-stone-850 md:border-gold-200/30 dark:border-gold-800/20 transition-colors duration-300 font-sans`}>
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-20 flex items-center justify-between">
        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden text-white dark:text-gold-100 hover:text-gold-500 transition-colors"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Brand Logo - Serif */}
        <Link to="/" className="flex items-center gap-2 select-none group">
          <LogoIcon className="w-8 h-8 text-gold-500 group-hover:scale-105 transition-transform" />
          <div className="flex flex-col items-center">
            <span className="font-serif text-xl sm:text-2xl font-bold tracking-widest text-white md:text-luxury-black dark:text-gold-200 group-hover:text-gold-500 transition-colors leading-none">
              SRUSHTI
            </span>
            <span className="text-[8px] tracking-[0.3em] font-light text-gold-400 md:text-gold-600 dark:text-gold-400 mt-0.5">
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
        <div className="flex items-center space-x-1 sm:space-x-4">
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

          {/* Search Icon - Mobile only */}
          <button
            onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
            className="lg:hidden p-2 text-white hover:text-gold-500 transition-colors rounded-full"
            aria-label="Search"
          >
            <Search size={20} />
          </button>

          {/* Wishlist Link */}
          <Link
            to="/collections?filter=wishlist"
            className="p-2 text-white md:text-gray-700 dark:text-gray-300 hover:text-gold-500 transition-colors rounded-full relative"
            aria-label="Wishlist"
          >
            <Heart size={20} />
            {wishlist.length > 0 && (
              <span className="absolute top-0 right-0 w-[18px] h-[18px] bg-gold-500 text-stone-950 text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                {wishlist.length}
              </span>
            )}
          </Link>

          {/* Cart Link */}
          <Link
            to="/cart"
            className="p-2 text-white md:text-gray-700 dark:text-gray-300 hover:text-gold-500 transition-colors rounded-full relative"
            aria-label="Shopping Cart"
          >
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 w-[18px] h-[18px] bg-gold-500 text-stone-950 text-[10px] font-bold rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          {/* User Account / Admin Dashboard / Login */}
          {isAdmin ? (
            <div className="hidden sm:flex items-center space-x-1 border border-gold-300/40 px-3 py-1 rounded-full bg-gold-50/30 dark:bg-stone-900/40">
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
            <div className="hidden sm:flex items-center space-x-1 border border-gold-300/40 px-3 py-1 rounded-full bg-gold-50/30 dark:bg-stone-900/40">
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
              className="hidden sm:inline-block p-2 text-gray-700 dark:text-gray-300 hover:text-gold-500 transition-colors rounded-full"
              title="Customer Login"
            >
              <User size={20} />
            </Link>
          )}

          {/* Track Order - Desktop */}
          <Link
            to="/track-order"
            className="hidden sm:inline-block px-2.5 py-1.5 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:text-gold-500 transition-colors uppercase tracking-wider text-[10px]"
            title="Track Order"
          >
            Track Order
          </Link>

        </div>
      </div>
      </nav>

      {/* Mobile Search Slide-down */}
      {isMobileSearchOpen && (
        <div className="lg:hidden bg-stone-950 border-b border-stone-800 px-4 py-3 animate-fade-in z-40 relative">
          <form onSubmit={(e) => { handleSearchSubmit(e); setIsMobileSearchOpen(false); }} className="relative">
            <input
              autoFocus
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search jewellery..."
              className="w-full bg-stone-900 border border-stone-700 rounded-full py-2.5 pl-5 pr-12 focus:outline-none focus:border-gold-500 text-sm text-white placeholder-stone-500"
            />
            <button type="submit" className="absolute right-4 top-2.5 text-stone-400 hover:text-gold-500 transition-colors">
              <Search size={18} />
            </button>
          </form>
        </div>
      )}

      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-stone-950/80 animate-fade-in flex">
          <div className="w-4/5 max-w-sm bg-stone-950 border-r border-stone-850 p-6 flex flex-col h-full shadow-2xl text-white">
            {/* Header */}
            <div className="flex justify-between items-center mb-8 border-b border-stone-850 pb-4">
              <span className="font-serif font-bold text-lg tracking-widest text-gold-500">
                SRUSHTI JEWELLERY
              </span>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-stone-400 hover:text-white p-1 transition-colors"
                aria-label="Close menu"
              >
                <X size={24} />
              </button>
            </div>

            {/* Links Stack */}
            <div className="flex flex-col space-y-2">
              {menuItems.map((item) => {
                const isActive = item.path === "/"
                  ? currentPath === "/"
                  : currentPath.startsWith(item.path);
                return (
                  <Link
                    key={item.label}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`text-base font-bold py-2.5 px-4 rounded-xl transition-all duration-300 text-left flex items-center ${
                      isActive
                        ? "bg-gold-500 text-stone-950 font-extrabold shadow-md"
                        : "text-stone-200 hover:text-gold-400 border-b border-stone-900"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
              
              {/* User Account / Profile */}
              {user ? (
                <div className="flex flex-col space-y-2 border-b border-stone-900 py-2 text-left">
                  <span className="text-[10px] text-stone-400 font-medium pl-2">Logged in as {user.name}</span>
                  <Link
                    to={user.role === "admin" ? "/admin" : "/account"}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-base font-bold text-gold-500 hover:text-gold-400 flex items-center gap-2"
                  >
                    {user.role === "admin" ? <ShieldCheck size={18} /> : <User size={18} />}
                    {user.role === "admin" ? "Admin Dashboard" : "My Profile Account"}
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="text-base font-bold text-red-400 hover:text-red-300 flex items-center gap-2 py-2 text-left cursor-pointer"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  to="/account"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-base font-bold text-gold-500 hover:text-gold-400 py-2 flex items-center gap-2 border-b border-stone-900 text-left"
                >
                  <User size={18} />
                  Login / Register
                </Link>
              )}

              {/* Track Order - Mobile */}
              <Link
                to="/track-order"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-base font-bold text-stone-200 hover:text-gold-400 py-2 border-b border-stone-900 flex items-center gap-2 text-left"
              >
                Track Order
              </Link>
            </div>

            {/* Timings summary */}
            <div className="mt-auto pt-6 border-t border-stone-900 text-xs text-stone-400 space-y-2">
              <p className="font-serif text-stone-200 font-bold">Showroom Timings:</p>
              <p>Mon - Sat: 10:30 AM - 8:30 PM</p>
              <p>Sunday: 11:30 AM - 6:00 PM</p>
            </div>
          </div>
          {/* Backdrop click closer */}
          <div className="flex-1" onClick={() => setIsMobileMenuOpen(false)}></div>
        </div>
      )}
    </>
  );
};
