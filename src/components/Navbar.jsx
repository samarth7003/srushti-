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
  LogOut,
  Package
} from "lucide-react";
import { LogoIcon } from "./LogoIcon";

export const Navbar = () => {
  const { cartCount, wishlist } = useCart();
  const { user, isAdmin, logout } = useAuth();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { pathname: currentPath } = useLocation();

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
    { label: "About", path: "/about" },
    { label: "Reviews", path: "/reviews" },
    { label: "Contact", path: "/contact" }
  ];

  const isActive = (path) =>
    path === "/" ? currentPath === "/" : currentPath.startsWith(path);

  return (
    <>
      {/* ── Main Navbar ──────────────────────────────── */}
      <nav
        className={`sticky top-0 ${
          isMobileMenuOpen ? "z-50" : "z-40"
        } bg-white/96 backdrop-blur-xl border-b border-black/[0.06] transition-colors duration-300 font-sans shadow-[0_2px_16px_rgba(0,0,0,0.06)]`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 md:h-[70px] flex items-center justify-between gap-4">
          
          {/* Mobile burger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-ink-800 hover:text-gold-500 transition-colors p-1"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 select-none group shrink-0">
            <LogoIcon className="w-8 h-8 text-gold-500 group-hover:scale-105 transition-transform duration-300" />
            <div className="flex flex-col leading-none">
              <span className="font-serif text-lg sm:text-xl font-bold tracking-[0.18em] text-ink-900 group-hover:text-gold-600 transition-colors">
                SRUSHTI
              </span>
              <span className="text-[7px] tracking-[0.3em] font-semibold text-gold-500 uppercase">
                JEWELLERY
              </span>
            </div>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-0.5">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                to={item.path}
                className={`relative text-sm font-medium tracking-wide px-3.5 py-1.5 transition-colors duration-255 group ${
                  isActive(item.path)
                    ? "text-gold-600"
                    : "text-ink-600 hover:text-gold-600"
                }`}
              >
                {item.label}
                <span
                  className={`absolute bottom-0 left-0 right-0 h-[1.5px] bg-gold-500 origin-left transition-transform duration-300 ${
                    isActive(item.path) ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                  }`}
                />
              </Link>
            ))}
          </div>

          {/* Right icons */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Desktop search */}
            <form onSubmit={handleSearchSubmit} className="hidden lg:flex items-center relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search jewellery…"
                className="bg-transparent border-b border-ink-200 text-sm py-2 pl-1 pr-8 focus:outline-none focus:border-gold-500 w-56 font-light placeholder-ink-400"
              />
              <button
                type="submit"
                className="absolute right-1 bottom-2.5 text-ink-400 hover:text-gold-500 transition-colors"
              >
                <Search size={15} />
              </button>
            </form>

            {/* Track Order */}
            <Link
              to="/track-order"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-semibold text-ink-600 hover:text-gold-600 transition-colors uppercase tracking-[0.15em] rounded-full hover:bg-gold-50 border border-transparent hover:border-gold-200"
            >
              <Package size={13} />
              Track
            </Link>

            {/* Wishlist */}
            <Link
              to="/collections?filter=wishlist"
              className="p-2 text-ink-700 hover:text-gold-500 hover:bg-gold-50 transition-colors rounded-full relative"
              aria-label="Wishlist"
            >
              <Heart size={19} />
              {wishlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-gold-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>

            <Link
              id="desktop-cart-icon"
              to="/cart"
              className="p-2 text-ink-700 hover:text-gold-500 hover:bg-gold-50 transition-colors rounded-full relative"
              aria-label="Shopping Cart"
            >
              <ShoppingBag size={19} />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-gold-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center animate-heart-pop">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User / Admin */}
            {isAdmin ? (
              <div className="hidden sm:flex items-center gap-1 border border-gold-200 bg-gold-50 px-3 py-1.5 rounded-full">
                <Link
                  to="/admin"
                  className="text-xs font-semibold text-gold-700 hover:text-gold-600 transition-colors flex items-center gap-1"
                >
                  <ShieldCheck size={14} />
                  Admin
                </Link>
                <button
                  onClick={logout}
                  className="text-ink-400 hover:text-red-500 p-0.5 transition-colors ml-1"
                  title="Logout"
                >
                  <LogOut size={13} />
                </button>
              </div>
            ) : user ? (
              <div className="hidden sm:flex items-center gap-1 border border-ink-100 bg-ink-50 px-3 py-1.5 rounded-full">
                <Link
                  to="/account"
                  className="text-xs font-semibold text-ink-700 hover:text-gold-600 transition-colors flex items-center gap-1"
                >
                  <User size={14} />
                  <span className="truncate max-w-[70px]">{user.name}</span>
                </Link>
                <button
                  onClick={logout}
                  className="text-ink-400 hover:text-red-500 p-0.5 transition-colors ml-1"
                  title="Logout"
                >
                  <LogOut size={13} />
                </button>
              </div>
            ) : (
              <Link
                to="/account"
                className="hidden sm:inline-flex p-2 text-ink-700 hover:text-gold-500 hover:bg-gold-50 transition-colors rounded-full"
                title="Login / Register"
              >
                <User size={19} />
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* ── Mobile search bar ─────────────────────────── */}
      <form onSubmit={handleSearchSubmit} className="lg:hidden sticky top-16 md:top-[70px] z-40 bg-white px-4 py-2 relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search jewellery…"
          className="w-full bg-transparent border-b border-ink-200 text-sm text-ink-900 placeholder-ink-400 font-sans py-2 pl-1 pr-8 focus:outline-none focus:border-gold-500 transition-all"
        />
        <button type="submit" className="absolute right-5 bottom-4 text-ink-400 hover:text-gold-500 transition-colors">
          <Search size={16} />
        </button>
      </form>

      {/* ── Mobile slide-in drawer ─────────────────────── */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex animate-fade-in">
          <div className="w-[80%] max-w-[320px] bg-white border-r border-black/[0.06] p-6 flex flex-col h-full shadow-2xl">
            {/* Header */}
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-ink-100">
              <div className="flex items-center gap-2">
                <LogoIcon className="w-7 h-7 text-gold-500" />
                <span className="font-serif font-bold text-lg tracking-[0.15em] text-ink-900">
                  SRUSHTI
                </span>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1 text-ink-400 hover:text-ink-900 transition-colors"
                aria-label="Close menu"
              >
                <X size={22} />
              </button>
            </div>

            {/* Nav links */}
            <nav className="flex flex-col gap-1">
              {menuItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`text-[15px] font-medium py-3 px-4 rounded-xl transition-all ${
                    isActive(item.path)
                      ? "bg-gold-50 text-gold-700 font-semibold"
                      : "text-ink-700 hover:bg-ink-50 hover:text-ink-900"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="mt-4 pt-4 border-t border-ink-100 flex flex-col gap-2">
              <Link
                to="/track-order"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-[15px] font-medium py-3 px-4 rounded-xl text-ink-700 hover:bg-ink-50 flex items-center gap-2"
              >
                <Package size={16} className="text-gold-500" />
                Track Order
              </Link>

              {user ? (
                <>
                  <Link
                    to={user.role === "admin" ? "/admin" : "/account"}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-[15px] font-medium py-3 px-4 rounded-xl text-gold-700 bg-gold-50 flex items-center gap-2"
                  >
                    {user.role === "admin" ? <ShieldCheck size={16} /> : <User size={16} />}
                    {user.role === "admin" ? "Admin Dashboard" : `Hello, ${user.name}`}
                  </Link>
                  <button
                    onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                    className="text-[15px] font-medium py-3 px-4 rounded-xl text-red-500 hover:bg-red-50 flex items-center gap-2 text-left cursor-pointer"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/account"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-[15px] font-semibold py-3 px-4 rounded-xl bg-gold-500 text-white flex items-center gap-2 justify-center"
                >
                  <User size={16} />
                  Login / Register
                </Link>
              )}
            </div>

            {/* Footer */}
            <div className="mt-auto pt-6 border-t border-ink-100 text-xs text-ink-400 space-y-1">
              <p className="font-semibold text-ink-600 font-serif">Showroom Timings</p>
              <p>Mon – Sat: 10:30 AM – 8:30 PM</p>
              <p>Sunday: 11:30 AM – 6:00 PM</p>
            </div>
          </div>

          {/* Backdrop */}
          <div className="flex-1 bg-black/40 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
        </div>
      )}
    </>
  );
};
