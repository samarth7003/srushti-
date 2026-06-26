import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { Home, Compass, Heart, ShoppingBag, User } from "lucide-react";

export const MobileBottomNav = () => {
  const location = useLocation();
  const { cartCount, wishlist } = useCart();
  const { user } = useAuth();
  
  const currentPath = location.pathname;

  const navItems = [
    {
      label: "Home",
      path: "/",
      icon: <Home size={20} />
    },
    {
      label: "Explore",
      path: "/collections",
      icon: <Compass size={20} />
    },
    {
      label: "Wishlist",
      path: "/collections?filter=wishlist",
      icon: <Heart size={20} />,
      badge: wishlist.length
    },
    {
      label: "Cart",
      path: "/cart",
      icon: <ShoppingBag size={20} />,
      badge: cartCount
    },
    {
      label: "Account",
      path: "/account",
      icon: <User size={20} />
    }
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-luxury-black/95 backdrop-blur-md border-t border-gold-200/25 dark:border-stone-850/40 py-2 px-6 flex justify-between items-center shadow-lg transition-colors duration-300 font-sans">
      {navItems.map((item) => {
        const isActive = (() => {
          if (item.path === "/") {
            return currentPath === "/";
          }
          if (item.label === "Wishlist") {
            return currentPath === "/collections" && location.search.includes("filter=wishlist");
          }
          if (item.label === "Explore") {
            return currentPath === "/collections" && !location.search.includes("filter=wishlist");
          }
          return currentPath.startsWith(item.path.split("?")[0]);
        })();

        return (
          <Link
            key={item.label}
            to={item.path}
            className={`flex flex-col items-center justify-center relative py-1 text-center shrink-0 w-14 transition-colors ${
              isActive
                ? "text-gold-600 dark:text-gold-400 font-semibold"
                : "text-gray-400 hover:text-gray-600 dark:hover:text-stone-300"
            }`}
          >
            {/* Icon and relative badge */}
            <div className="relative">
              {item.icon}
              {item.badge !== undefined && item.badge > 0 && (
                <span className="absolute -top-1.5 -right-2.5 bg-gold-500 text-stone-950 text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </div>
            
            {/* Label */}
            <span className="text-[10px] tracking-wide mt-1 leading-none">{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
};
