import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { getOrders } from "../services/db";
import { ProductImage } from "../components/ProductImage";
import {
  User,
  ShoppingBag,
  Heart,
  LogOut,
  Mail,
  ShieldCheck,
  Calendar,
  Lock,
  ArrowRight,
  UserPlus,
  Eye,
  EyeOff
} from "lucide-react";
import { LogoIcon } from "../components/LogoIcon";

export const Account = ({ addToast }) => {
  const { user, isAdmin, login, signup, logout } = useAuth();
  const { wishlist, removeFromCart, addToCart } = useCart();
  const navigate = useNavigate();

  // Tab: "login" or "register"
  const [formTab, setFormTab] = useState("login");

  // Login states
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register states
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");

  // Loading & Orders history states
  const [loading, setLoading] = useState(false);
  const [customerOrders, setCustomerOrders] = useState([]);

  // Show/Hide password toggles
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Fetch customer orders when user logs in
  useEffect(() => {
    const loadCustomerOrders = async () => {
      if (user && user.role === "customer") {
        try {
          const allOrders = await getOrders();
          // Filter orders matching logged-in user name (case insensitive) or email
          const matched = allOrders.filter(
            (o) =>
              o.customerName.toLowerCase() === user.name.toLowerCase() ||
              (o.email && o.email.toLowerCase() === user.email.toLowerCase())
          );
          setCustomerOrders(matched);
        } catch (err) {
          console.error("Failed to load customer orders", err);
        }
      }
    };
    loadCustomerOrders();
  }, [user]);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      addToast("Please fill in email and password.", "error");
      return;
    }

    setLoading(true);
    try {
      const loggedUser = await login(loginEmail, loginPassword);
      addToast(`Welcome back, ${loggedUser.name}!`, "success");
      
      // Redirect if admin
      if (loggedUser.role === "admin") {
        navigate("/admin");
      }
    } catch (err) {
      addToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!regName || !regEmail || !regPassword) {
      addToast("Please fill in all registration fields.", "error");
      return;
    }

    if (regPassword !== regConfirmPassword) {
      addToast("Passwords do not match.", "error");
      return;
    }

    if (regPassword.length < 5) {
      addToast("Password must be at least 5 characters.", "error");
      return;
    }

    setLoading(true);
    try {
      const newUser = await signup(regEmail, regPassword, regName);
      addToast(`Account created successfully! Welcome ${newUser.name}.`, "success");
    } catch (err) {
      addToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  // Format Price as INR
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(price);
  };

  // Render Logged-In customer dashboard
  if (user && user.role === "customer") {
    return (
      <div className="bg-gold-50/20 dark:bg-luxury-black transition-colors duration-300 font-sans text-left py-12 px-6 min-h-screen">
        <div className="max-w-6xl mx-auto space-y-10">
          {/* Profile Welcome banner */}
          <div className="bg-white dark:bg-luxury-charcoal p-6 sm:p-8 rounded-3xl border border-gold-200/50 dark:border-stone-850/40 shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gold-500/10 text-gold-500 rounded-full flex items-center justify-center border border-gold-300/30 text-2xl font-serif font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="space-y-1">
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-luxury-black dark:text-white">
                  Namaste, {user.name}
                </h1>
                <p className="text-xs text-gray-400 font-light flex items-center gap-1.5">
                  <Mail size={12} /> {user.email} &bull; Customer Account
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                logout();
                addToast("Logged out successfully.", "info");
              }}
              className="border border-red-500/30 text-red-500 hover:bg-red-500/10 px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut size={14} /> Log Out
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: Orders history */}
            <div className="lg:col-span-7 bg-white dark:bg-luxury-charcoal p-6 rounded-3xl border border-gold-100/50 dark:border-stone-850/40 shadow-sm space-y-6">
              <h3 className="font-serif text-xl font-bold text-luxury-black dark:text-white border-b border-gold-100/10 dark:border-stone-800/20 pb-3 flex items-center gap-2">
                <ShoppingBag className="text-gold-500" size={20} /> Your Purchase History ({customerOrders.length})
              </h3>

              {customerOrders.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <span className="text-3xl">🛍️</span>
                  <h4 className="font-serif font-bold text-gray-400">No Orders Found</h4>
                  <p className="text-xs text-gray-400 font-light max-w-xs mx-auto leading-relaxed">
                    You haven't placed any boutique orders under this account name yet. Designs you purchase will list here.
                  </p>
                  <Link
                    to="/collections"
                    className="inline-flex items-center gap-1 bg-gold-500 hover:bg-gold-600 text-stone-950 px-5 py-2 rounded-xl text-[10px] uppercase font-bold tracking-wider"
                  >
                    Start Browsing <ArrowRight size={10} />
                  </Link>
                </div>
              ) : (
                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
                  {customerOrders.map((order) => (
                    <div
                      key={order.id}
                      className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-900 border border-gold-200/15 space-y-3"
                    >
                      <div className="flex justify-between items-center text-xs">
                        <div>
                          <span className="font-bold text-luxury-black dark:text-white block">{order.id}</span>
                          <span className="text-[10px] text-gray-400">
                            {new Date(order.date).toLocaleDateString("en-IN")}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="bg-gold-500/20 text-gold-700 dark:text-gold-300 font-bold px-2 py-0.5 rounded text-[9px] uppercase tracking-wider">
                            {order.orderStatus}
                          </span>
                          <span className="block font-serif font-bold text-luxury-black dark:text-gold-300 mt-1">
                            {formatPrice(order.total)}
                          </span>
                        </div>
                      </div>
                      
                      {/* Tracking link */}
                      <Link
                        to={`/track-order?id=${order.id}`}
                        className="text-[10px] uppercase font-bold text-gold-600 hover:text-gold-500 flex items-center gap-1.5"
                      >
                        Track Shipment Timeline &rarr;
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Wishlist panel */}
            <div className="lg:col-span-5 bg-white dark:bg-luxury-charcoal p-6 rounded-3xl border border-gold-100/50 dark:border-stone-850/40 shadow-sm space-y-6">
              <h3 className="font-serif text-xl font-bold text-luxury-black dark:text-white border-b border-gold-100/10 dark:border-stone-800/20 pb-3 flex items-center gap-2">
                <Heart className="text-gold-500" size={20} /> Saved Wishlist ({wishlist.length})
              </h3>

              {wishlist.length === 0 ? (
                <div className="text-center py-12 text-gray-400 space-y-2">
                  <span>🖤</span>
                  <p className="text-xs font-light">No designs saved in your wishlist yet.</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[500px] overflow-y-auto">
                  {wishlist.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center gap-3 justify-between p-3 rounded-2xl bg-stone-50 dark:bg-stone-900 border border-stone-250/10"
                    >
                      <div className="flex gap-2 items-center min-w-0">
                        <div className="w-10 h-10 rounded overflow-hidden bg-white shrink-0">
                          <ProductImage src={p.images?.[0]} alt={p.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0 text-left">
                          <Link to={`/product/${p.id}`} className="font-serif text-xs font-bold text-luxury-black dark:text-stone-200 block truncate hover:text-gold-500">
                            {p.name}
                          </Link>
                          <span className="font-semibold text-[10px] text-gold-600">{formatPrice(p.price)}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          addToCart(p, 1);
                          addToast(`${p.name} added to cart!`, "success");
                        }}
                        className="bg-gold-500 text-stone-950 font-bold px-3 py-1.5 rounded-lg text-[9px] uppercase tracking-wider hover:bg-gold-600 transition-colors cursor-pointer"
                      >
                        Add
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render customer Login & Registration Tab form
  return (
    <div className="w-full max-w-md mx-auto px-4">
      <div className="bg-white border border-black/[0.06] p-8 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.03)] space-y-6 text-center animate-scale-up">
        
        {/* Brand Logo Header */}
        <div className="flex flex-col items-center select-none mb-2">
          <LogoIcon className="w-10 h-10 text-gold-500 mb-2" />
          <span className="font-serif text-xl font-semibold tracking-[0.2em] text-ink-900 uppercase leading-none">
            SRUSHTI
          </span>
          <span className="text-[8px] tracking-[0.3em] font-light text-gold-600 uppercase mt-1">
            JEWELLERY
          </span>
        </div>

        {/* Toggle tabs */}
        <div className="flex border-b border-black/[0.06] text-xs uppercase tracking-wider">
          <button
            onClick={() => setFormTab("login")}
            className={`w-1/2 pb-3 font-medium transition-all relative cursor-pointer ${
              formTab === "login"
                ? "text-gold-600 font-bold"
                : "text-ink-400 hover:text-ink-900"
            }`}
          >
            Sign In
            {formTab === "login" && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold-600"></span>}
          </button>
          
          <button
            onClick={() => setFormTab("register")}
            className={`w-1/2 pb-3 font-medium transition-all relative cursor-pointer ${
              formTab === "register"
                ? "text-gold-600 font-bold"
                : "text-ink-400 hover:text-ink-900"
            }`}
          >
            Register
            {formTab === "register" && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold-600"></span>}
          </button>
        </div>

        {/* Tab content rendering */}
        {formTab === "login" ? (
          /* LOGIN FORM */
          <form onSubmit={handleLoginSubmit} className="space-y-4 text-left">
            <div className="text-center sm:text-left mb-2">
              <h2 className="font-serif text-lg font-bold text-ink-900">
                Welcome Back
              </h2>
              <p className="text-ink-400 text-[11px] mt-0.5 font-light">
                Sign in to view your orders and manage saved items.
              </p>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-semibold text-ink-400 uppercase tracking-wider block">Email Address</label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="email@example.com"
                className="w-full bg-stone-50/60 border border-black/20 rounded-lg p-3 text-sm focus:outline-none focus:bg-white focus:border-gold-600 focus:ring-2 focus:ring-gold-500/10 text-ink-900 placeholder-black/40 transition-all"
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-[9px] font-semibold text-ink-400 uppercase tracking-wider block">Password</label>
              <div className="relative">
                <input
                  type={showLoginPassword ? "text" : "password"}
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-stone-50/60 border border-black/20 rounded-lg p-3 pr-10 text-sm focus:outline-none focus:bg-white focus:border-gold-600 focus:ring-2 focus:ring-gold-500/10 text-ink-900 placeholder-black/40 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute right-3 top-3 text-ink-400 hover:text-gold-600 transition-colors"
                >
                  {showLoginPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-ink-900 hover:bg-gold-600 text-white hover:text-ink-950 font-bold uppercase tracking-wider py-3.5 rounded-lg text-[10px] transition-all duration-300 shadow-sm flex items-center justify-center cursor-pointer"
            >
              {loading ? "Verifying..." : "Sign In"}
            </button>
          </form>
        ) : (
          /* CREATE ACCOUNT FORM */
          <form onSubmit={handleRegisterSubmit} className="space-y-4 text-left">
            <div className="text-center sm:text-left mb-2">
              <h2 className="font-serif text-lg font-bold text-ink-900">
                Create Account
              </h2>
              <p className="text-ink-400 text-[11px] mt-0.5 font-light">
                Sign up to save products and track purchases.
              </p>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-semibold text-ink-400 uppercase tracking-wider block">Full Name</label>
              <input
                type="text"
                required
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                placeholder="Full Name"
                className="w-full bg-stone-50/60 border border-black/20 rounded-lg p-3 text-sm focus:outline-none focus:bg-white focus:border-gold-600 focus:ring-2 focus:ring-gold-500/10 text-ink-900 placeholder-black/40 transition-all"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-semibold text-ink-400 uppercase tracking-wider block">Email Address</label>
              <input
                type="email"
                required
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                placeholder="email@example.com"
                className="w-full bg-stone-50/60 border border-black/20 rounded-lg p-3 text-sm focus:outline-none focus:bg-white focus:border-gold-600 focus:ring-2 focus:ring-gold-500/10 text-ink-900 placeholder-black/40 transition-all"
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-[9px] font-semibold text-ink-400 uppercase tracking-wider block">Password (Min 5 chars)</label>
              <div className="relative">
                <input
                  type={showRegPassword ? "text" : "password"}
                  required
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-stone-50/60 border border-black/20 rounded-lg p-3 pr-10 text-sm focus:outline-none focus:bg-white focus:border-gold-600 focus:ring-2 focus:ring-gold-500/10 text-ink-900 placeholder-black/40 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowRegPassword(!showRegPassword)}
                  className="absolute right-3 top-3 text-ink-400 hover:text-gold-600 transition-colors"
                >
                  {showRegPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-semibold text-ink-400 uppercase tracking-wider block">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={regConfirmPassword}
                  onChange={(e) => setRegConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-stone-50/60 border border-black/20 rounded-lg p-3 pr-10 text-sm focus:outline-none focus:bg-white focus:border-gold-600 focus:ring-2 focus:ring-gold-500/10 text-ink-900 placeholder-black/40 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 text-ink-400 hover:text-gold-600 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-ink-900 hover:bg-gold-600 text-white hover:text-ink-950 font-bold uppercase tracking-wider py-3 rounded-lg text-[10px] transition-all duration-300 shadow-sm flex items-center justify-center cursor-pointer"
            >
              {loading ? "Registering..." : "Create Account"}
            </button>
          </form>
        )}

        {/* Quick redirect links details */}
        <div className="bg-stone-50 p-3 rounded-lg text-[9px] text-ink-400 font-light border border-black/[0.04] flex items-center justify-center gap-1">
          🔐 Staff member?
          <Link to="/admin" className="font-bold text-gold-600 hover:underline">
            Go to Admin Login &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
};
