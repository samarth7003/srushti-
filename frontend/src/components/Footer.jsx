import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, ArrowRight } from "lucide-react";
import { LogoIcon } from "./LogoIcon";

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" style={{ fill: "none", stroke: "none" }}>
    <defs>
      <linearGradient id="ig-grad" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#feda75" />
        <stop offset="25%" stopColor="#fa7e1e" />
        <stop offset="50%" stopColor="#d62976" />
        <stop offset="75%" stopColor="#962fbf" />
        <stop offset="100%" stopColor="#4f5bd5" />
      </linearGradient>
    </defs>
    <rect x="0" y="0" width="24" height="24" rx="6" fill="url(#ig-grad)" style={{ fill: "url(#ig-grad)", stroke: "none" }} />
    <g fill="none" stroke="#ffffff" strokeWidth="1.5" style={{ fill: "none", stroke: "#ffffff" }}>
      <rect x="5.5" y="5.5" width="13" height="13" rx="3.5" style={{ fill: "none", stroke: "#ffffff" }} />
      <circle cx="12" cy="12" r="3" style={{ fill: "none", stroke: "#ffffff" }} />
      <circle cx="15.75" cy="8.25" r="0.5" fill="#ffffff" style={{ fill: "#ffffff", stroke: "none" }} />
    </g>
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" style={{ fill: "none", stroke: "none" }}>
    <circle cx="12" cy="12" r="12" fill="#1877F2" style={{ fill: "#1877F2", stroke: "none" }} />
    <path d="M14 12h-2v7H9.5v-7H8V9.5h1.5v-2c0-1.8.8-2.8 2.5-2.8h1.8v2.1h-1.2c-.8 0-.9.3-.9.9v1.8H14l-.3 2.5z" fill="#ffffff" style={{ fill: "#ffffff", stroke: "none" }} />
  </svg>
);

const YoutubeIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" style={{ fill: "none", stroke: "none" }}>
    <rect x="0" y="0" width="24" height="24" rx="6" fill="#FF0000" style={{ fill: "#FF0000", stroke: "none" }} />
    <polygon points="9.5 7.5 16.5 12 9.5 16.5 9.5 7.5" fill="#ffffff" style={{ fill: "#ffffff", stroke: "none" }} />
  </svg>
);

const WhatsappIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" style={{ fill: "none", stroke: "none" }}>
    <circle cx="12" cy="12" r="12" fill="#25D366" style={{ fill: "#25D366", stroke: "none" }} />
    <path d="M12.012 4.25a7.75 7.75 0 0 0-6.685 11.666l-.545 1.993 2.04-.535a7.747 7.747 0 0 0 5.19 1.127h.5a7.75 7.75 0 0 0 6.685-11.666h-.002a7.75 7.75 0 0 0-7.183-2.585zM15.82 13.91c-.244.686-1.22 1.262-1.74 1.32-.477.054-.925.077-1.464-.08a7.842 7.842 0 0 1-3.238-1.523 18.069 18.069 0 0 1-4.48-4.475 7.834 7.834 0 0 1-1.527-3.24c-.16-.54-.136-.988-.083-1.465.06-.52.637-1.496 1.323-1.74.208-.073.344-.052.483.084.14.137.47.46.643.644.173.184.225.29.33.5.104.207.052.395-.027.552-.08.156-.72.676-.84.815-.12.138-.24.156-.448.052-.208-.104-.88-.324-1.676-1.034-.62-.553-1.038-1.237-1.16-1.446-.12-.208-.01-.321.094-.425.094-.094.208-.24.312-.36.104-.12.138-.208.208-.346.07-.138.035-.26-.017-.364-.052-.104-.47-1.132-.644-1.551-.17-.409-.344-.354-.47-.36h-.4c-.139 0-.365.052-.556.26-.191.208-.73.712-.73 1.734 0 1.022.747 2.009.851 2.147.104.138 1.47 2.245 3.562 3.146.498.215.887.344 1.192.441.503.16.96.137 1.32.083.402-.06 1.229-.503 1.402-.99.172-.487.172-.904.121-.991-.051-.087-.191-.139-.399-.243z" fill="#ffffff" style={{ fill: "#ffffff", stroke: "none" }} transform="scale(0.8) translate(3, 3)" />
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
                className="w-9 h-9 flex items-center justify-center hover:scale-110 transition-transform duration-200"
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

      {/* ── Copyright ──────────────────────────────── */}
      <div className="border-t border-white/[0.04] py-4 text-center text-[11px] text-neutral-500 bg-black/20">
        &copy; {new Date().getFullYear()} Srushti Jewellery. All Rights Reserved.
      </div>
    </footer>
  );
};
