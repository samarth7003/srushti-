import React, { useState } from "react";
import { MessageSquare, X } from "lucide-react";

export const WhatsAppFloat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const phoneNumber = "+919876543210"; // Placeholder business number
  const message = "Hi! I am browsing Srushti Jewellery and would like to enquire about your collections.";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <div className="fixed bottom-20 md:bottom-6 right-6 z-50 flex flex-col items-end font-sans">
      {/* Tooltip banner */}
      {isOpen && (
        <div className="mb-3 bg-white dark:bg-luxury-charcoal text-luxury-black dark:text-gold-100 p-4 rounded-2xl shadow-2xl border border-gold-200/50 dark:border-gold-800/30 max-w-xs animate-fade-in">
          <div className="flex justify-between items-start mb-2">
            <span className="font-serif font-bold text-luxury-black dark:text-gold-300 text-sm">
              Srushti Jewellery Support
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
            >
              <X size={14} />
            </button>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-3">
            Namaste! How can we assist you with our jewellery collections today?
          </p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-xl text-xs font-semibold tracking-wide transition-all shadow-md"
          >
            Start WhatsApp Chat
          </a>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-14 h-14 bg-emerald-500 text-white rounded-full shadow-2xl hover:bg-emerald-600 hover:scale-105 active:scale-95 transition-all duration-300 relative group"
        aria-label="Enquire on WhatsApp"
      >
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-600"></span>
        </span>
        <MessageSquare size={26} className="group-hover:rotate-6 transition-transform" />
      </button>
    </div>
  );
};
