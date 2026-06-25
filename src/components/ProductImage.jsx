import React from "react";

// This component renders either the uploaded custom item image or
// an ultra-premium, dark-themed gold-embellished placeholder.
export const ProductImage = ({ src, alt, className = "" }) => {
  // If it's a data URI, external URL, or uploaded blob/path, render standard image element
  if (
    src &&
    (src.startsWith("data:") ||
      src.startsWith("http") ||
      src.startsWith("blob:") ||
      src.startsWith("/uploads/"))
  ) {
    return (
      <img
        src={src}
        alt={alt}
        className={`${className} object-cover`}
        onError={(e) => {
          // If the image fails to load, hide this element to let fallback show
          e.target.style.display = "none";
        }}
      />
    );
  }

  // Otherwise, render an elegant, premium dark-themed placeholder
  // so the user can easily add their own photographs later.
  return (
    <div className={`${className} bg-gradient-to-br from-stone-900 via-stone-950 to-neutral-950 flex flex-col items-center justify-center relative overflow-hidden select-none p-4`}>
      {/* Decorative premium radial gold glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(197,168,128,0.06),transparent_70%)]"></div>
      
      {/* Minimal Gold Diamond Wireframe Silhouette */}
      <svg
        viewBox="0 0 100 100"
        className="w-12 h-12 text-gold-500/25 mb-2.5 transition-transform duration-700 group-hover:scale-110"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polygon points="50,15 80,38 50,85 20,38" />
        <line x1="50" y1="15" x2="50" y2="85" />
        <line x1="20" y1="38" x2="80" y2="38" />
        <line x1="50" y1="15" x2="35" y2="38" />
        <line x1="50" y1="15" x2="65" y2="38" />
        <line x1="35" y1="38" x2="50" y2="85" />
        <line x1="65" y1="38" x2="50" y2="85" />
      </svg>
      
      {/* Subtle luxury brand signature */}
      <span className="font-serif text-[10px] tracking-[0.3em] text-gold-500/50 uppercase leading-none">
        SRUSHTI
      </span>
      <span className="text-[7px] tracking-[0.2em] text-stone-500 uppercase mt-1 leading-none font-sans">
        JEWELLERY
      </span>
    </div>
  );
};
