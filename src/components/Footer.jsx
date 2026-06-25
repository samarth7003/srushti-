import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Phone, Mail, MapPin } from "lucide-react";
import { LogoIcon } from "./LogoIcon";

// Inline brand SVGs since recent Lucide releases removed brand logos
const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0 -5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

const YoutubeIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
  </svg>
);


export const Footer = ({ addToast }) => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    if (addToast) {
      addToast("Subscription successful! Thank you for joining Srushti Jewellery.", "success");
    } else {
      alert("Subscription successful!");
    }
    setEmail("");
  };

  return (
    <footer className="bg-stone-950 text-stone-300 font-sans border-t border-gold-800/30">

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand narrative */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-gold-400">
            <LogoIcon className="w-7 h-7" />
            <h3 className="font-serif text-2xl font-bold tracking-widest">SRUSHTI</h3>
          </div>
          <p className="text-sm text-stone-400 leading-relaxed font-light">
            Crafting elegant, modern, and traditional jewellery since 1994. Inspired by heritage and sculpted for the modern connoisseur.
          </p>
          <div className="flex space-x-4 pt-2">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-gold-400 transition-colors">
              <InstagramIcon />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-gold-400 transition-colors">
              <FacebookIcon />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:text-gold-400 transition-colors">
              <YoutubeIcon />
            </a>
          </div>

        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-serif text-white font-bold text-lg mb-6 tracking-wide">Collections</h4>
          <ul className="space-y-3 text-sm font-light">
            <li><Link to="/collections?category=Necklace Sets" className="hover:text-gold-400 transition-colors">Necklaces & Chokers</Link></li>
            <li><Link to="/collections?category=Earrings" className="hover:text-gold-400 transition-colors">Classic Earrings</Link></li>
            <li><Link to="/collections?category=Rings" className="hover:text-gold-400 transition-colors">Engagement & Solitaires</Link></li>
            <li><Link to="/collections?category=Bridal Collection" className="hover:text-gold-400 transition-colors">Heritage Bridal Sets</Link></li>
            <li><Link to="/collections?category=Festive Collection" className="hover:text-gold-400 transition-colors">Festive Special Wear</Link></li>
          </ul>
        </div>

        {/* Support & Store Info */}
        <div>
          <h4 className="font-serif text-white font-bold text-lg mb-6 tracking-wide">Customer Desk</h4>
          <ul className="space-y-3 text-sm font-light">
            <li><Link to="/track-order" className="hover:text-gold-400 transition-colors">Track Order Status</Link></li>
            <li><Link to="/reviews" className="hover:text-gold-400 transition-colors">Customer Reviews</Link></li>
            <li><Link to="/about" className="hover:text-gold-400 transition-colors">Our Story & Heritage</Link></li>
            <li><Link to="/contact" className="hover:text-gold-400 transition-colors">Contact Our Boutique</Link></li>
          </ul>
        </div>

        {/* Newsletter & Contact */}
        <div className="space-y-4">
          <h4 className="font-serif text-white font-bold text-lg tracking-wide">Stay Updated</h4>
          <p className="text-xs text-stone-400 font-light leading-relaxed">
            Subscribe to receive priority notifications on new arrivals, exclusive design catalogs, and VIP trunk shows.
          </p>
          <form onSubmit={handleSubscribe} className="flex">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="bg-stone-900 border border-stone-800 text-stone-200 px-4 py-2 text-sm rounded-l-md focus:outline-none focus:border-gold-500 w-full font-light"
              required
            />
            <button
              type="submit"
              className="bg-gold-500 hover:bg-gold-600 text-stone-950 font-bold px-4 py-2 rounded-r-md transition-colors text-sm"
            >
              Join
            </button>
          </form>
          
          <div className="pt-2 text-xs text-stone-400 space-y-2">
            <div className="flex items-center gap-2">
              <Phone size={14} className="text-gold-400" />
              <span>+91 98765 43210</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail size={14} className="text-gold-400" />
              <span>boutique@srushtijewellery.com</span>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright & Sign-off */}
      <div className="border-t border-stone-900 py-6 text-center text-xs text-stone-500 bg-stone-950/60 font-light">
        <p>&copy; {new Date().getFullYear()} Srushti Jewellery. All Rights Reserved. Crafted for Timeless Splendor.</p>
      </div>
    </footer>
  );
};
