import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Compass, BookOpen, Star, Phone } from "lucide-react";

export const MobileBottomNav = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    { label: "Home",        path: "/",            icon: <Home        size={19} /> },
    { label: "Collections", path: "/collections", icon: <Compass     size={19} /> },
    { label: "About",       path: "/about",       icon: <BookOpen    size={19} /> },
    { label: "Reviews",     path: "/reviews",     icon: <Star        size={19} /> },
    { label: "Contact",     path: "/contact",     icon: <Phone       size={19} /> }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/96 backdrop-blur-xl border-t border-black/[0.07] py-2 px-3 flex justify-around items-center shadow-[0_-4px_20px_rgba(0,0,0,0.07)] font-sans safe-area-bottom">
      {navItems.map((item) => {
        const isActive = item.path === "/" 
          ? currentPath === "/" 
          : currentPath.startsWith(item.path);

        return (
          <Link
            key={item.label}
            to={item.path}
            className={`flex flex-col items-center justify-center gap-1 py-1 px-3 rounded-xl transition-all duration-200 relative ${
              isActive
                ? "text-gold-600"
                : "text-ink-400 hover:text-ink-700"
            }`}
          >
            <div className="relative">
              {item.icon}
            </div>
            <span className={`text-[9px] font-medium leading-none tracking-wide ${isActive ? "font-semibold" : ""}`}>
              {item.label}
            </span>
            {isActive && (
              <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-gold-500" />
            )}
          </Link>
        );
      })}
    </div>
  );
};
