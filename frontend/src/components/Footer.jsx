import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, ArrowRight } from "lucide-react";
import { LogoIcon } from "./LogoIcon";

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const YoutubeIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
  </svg>
);

const WhatsappIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
);

export const Footer = ({ addToast }) => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    if (addToast) {
      addToast("Thank you for subscribing to Srushti Jewellery!", "success");
    }
    setEmail("");
  };

  const collectionsLinks = [
    { label: "Necklaces & Chokers", path: "/collections?category=Necklace Sets" },
    { label: "Classic Earrings", path: "/collections?category=Earrings" },
    { label: "Engagement & Solitaires", path: "/collections?category=Rings" },
    { label: "Heritage Bridal Sets", path: "/collections?category=Bridal Collection" },
    { label: "Festive Collection", path: "/collections?category=Festive Collection" }
  ];

  const helpLinks = [
    { label: "Track Your Order", path: "/track-order" },
    { label: "Customer Reviews", path: "/reviews" },
    { label: "Our Story & Heritage", path: "/about" },
    { label: "Contact Boutique", path: "/contact" }
  ];

  return (
    <footer className="bg-[#111111] text-neutral-400 font-sans">
      {/* ── Main grid ──────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 py-14 md:py-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 md:gap-8">

        {/* Brand column */}
        <div className="sm:col-span-2 md:col-span-1 space-y-5">
          <div className="flex items-center gap-2.5 text-white">
            <LogoIcon className="w-8 h-8 text-gold-400" />
            <div className="flex flex-col leading-none">
              <span className="font-serif text-xl font-bold tracking-[0.2em] text-white">SRUSHTI</span>
              <span className="text-[7px] tracking-[0.3em] text-gold-400 uppercase font-semibold">JEWELLERY</span>
            </div>
          </div>
          <p className="text-sm text-neutral-400 leading-relaxed font-light max-w-[260px]">
            Contemporary heirlooms crafted with intention, warmth, and a timeless sense of grace.
          </p>
          <div className="flex items-center gap-3">
            {[
              { href: "https://facebook.com", icon: <FacebookIcon />, label: "Facebook" },
              { href: "https://instagram.com", icon: <InstagramIcon />, label: "Instagram" },
              { href: "https://youtube.com", icon: <YoutubeIcon />, label: "YouTube" },
              { href: "https://wa.me/919876543210", icon: <WhatsappIcon />, label: "WhatsApp" }
            ].map(({ href, icon, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-neutral-400 hover:text-gold-400 hover:border-gold-500/40 transition-all duration-200"
              >
                {icon}
              </a>
            ))}
          </div>
        </div>

        {/* Collections */}
        <div>
          <h4 className="font-serif text-white font-semibold text-base mb-5 tracking-wide">Collections</h4>
          <ul className="space-y-3">
            {collectionsLinks.map(({ label, path }) => (
              <li key={label}>
                <Link
                  to={path}
                  className="text-sm text-neutral-400 hover:text-gold-400 transition-colors duration-200 flex items-center gap-1.5 group"
                >
                  <ArrowRight size={11} className="opacity-0 group-hover:opacity-100 -ml-1 transition-opacity text-gold-500" />
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Help */}
        <div>
          <h4 className="font-serif text-white font-semibold text-base mb-5 tracking-wide">Customer Desk</h4>
          <ul className="space-y-3">
            {helpLinks.map(({ label, path }) => (
              <li key={label}>
                <Link
                  to={path}
                  className="text-sm text-neutral-500 hover:text-gold-400 transition-colors duration-200 flex items-center gap-1.5 group"
                >
                  <ArrowRight size={11} className="opacity-0 group-hover:opacity-100 -ml-1 transition-opacity text-gold-500" />
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter + Contact */}
        <div className="space-y-5">
          <h4 className="font-serif text-white font-semibold text-base tracking-wide">Stay Updated</h4>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Get early access to new arrivals, exclusive offers, and styling inspiration.
          </p>
          <form onSubmit={handleSubscribe} className="flex rounded-full overflow-hidden border border-white/10 focus-within:border-gold-500/50 transition-colors">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="bg-white/[0.06] text-neutral-200 px-4 py-2.5 text-xs focus:outline-none w-full placeholder-neutral-500 font-light"
              required
            />
            <button
              type="submit"
              className="bg-gold-500 hover:bg-gold-400 text-white font-semibold px-4 py-2.5 text-xs transition-colors whitespace-nowrap shrink-0"
            >
              Join
            </button>
          </form>

          <div className="space-y-2.5 text-xs text-neutral-400">
            <div className="flex items-center gap-2.5">
              <Phone size={13} className="text-gold-500 shrink-0" />
              <span>+91 98765 43210</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Mail size={13} className="text-gold-500 shrink-0" />
              <span>boutique@srushtijewellery.com</span>
            </div>
            <div className="flex items-start gap-2.5">
              <MapPin size={13} className="text-gold-500 shrink-0 mt-0.5" />
              <span>Sangamner, Maharashtra, India</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Trust badges ───────────────────────────── */}
      <div className="border-t border-white/[0.06] py-5">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-[10px] text-neutral-400 uppercase tracking-[0.14em] font-medium">
          {["BIS 916 Hallmarked", "IGI Certified Diamonds", "Lifetime Exchange", "Free Insured Shipping", "Secure Payment"].map((badge) => (
            <span key={badge} className="flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-gold-500 inline-block" />
              {badge}
            </span>
          ))}
        </div>
      </div>

      {/* ── Copyright ──────────────────────────────── */}
      <div className="border-t border-white/[0.04] py-4 text-center text-[11px] text-neutral-500 bg-black/20">
        &copy; {new Date().getFullYear()} Srushti Jewellery. All Rights Reserved.
      </div>
    </footer>
  );
};
