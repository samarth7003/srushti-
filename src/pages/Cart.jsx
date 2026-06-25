import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { ProductImage } from "../components/ProductImage";
import { Trash2, ShoppingBag, ArrowRight } from "lucide-react";

export const Cart = () => {
  const {
    cart,
    removeFromCart,
    updateCartQty,
    cartSubtotal,
    cartTax,
    deliveryFee,
    cartTotal
  } = useCart();

  // Format Price as INR
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(price);
  };

  if (cart.length === 0) {
    return (
      <div className="bg-gold-50/20 dark:bg-luxury-black transition-colors duration-300 font-sans min-h-[70vh] py-20 px-6 flex items-center justify-center">
        <div className="max-w-md w-full text-center space-y-6">
          <span className="text-5xl block animate-bounce">👜</span>
          <h2 className="font-serif text-3xl font-bold text-luxury-black dark:text-white">
            Your Cart is Empty
          </h2>
          <p className="text-gray-500 font-light text-sm max-w-xs mx-auto leading-relaxed">
            Your shopping bag is waiting to be filled with exquisite handcrafted masterpieces.
          </p>
          <Link
            to="/collections"
            className="inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-600 text-stone-950 px-8 py-3.5 rounded-xl text-xs uppercase tracking-wider font-bold transition-all shadow-md"
          >
            Start Shopping <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gold-50/20 dark:bg-luxury-black transition-colors duration-300 font-sans min-h-screen py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-left mb-10 space-y-2">
          <h1 className="font-serif text-4xl font-light text-luxury-black dark:text-gold-200">
            Shopping Bag
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-light">
            Review your chosen designs and proceed to checkout.
          </p>
        </div>

        {/* Cart Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* 1. Left Column: Cart Items List */}
          <div className="lg:col-span-8 space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="bg-white dark:bg-luxury-charcoal p-5 rounded-2xl border border-gold-100/50 dark:border-stone-850/40 shadow-sm flex flex-col sm:flex-row items-center gap-6"
              >
                {/* Product Thumbnail Image */}
                <div className="w-24 h-24 rounded-xl overflow-hidden bg-stone-50 dark:bg-stone-950 shrink-0 border border-gold-100/30">
                  <ProductImage src={item.images?.[0]} alt={item.name} className="w-full h-full object-cover" />
                </div>

                {/* Details */}
                <div className="flex-grow text-left space-y-1">
                  <h3 className="font-serif text-lg font-bold text-luxury-black dark:text-white line-clamp-1">
                    {item.name}
                  </h3>
                  <div className="text-xs text-gray-400 space-y-0.5">
                    <p>Material: <span className="font-semibold text-gray-600 dark:text-stone-300">{item.material}</span></p>
                    <p>Gross Weight: <span className="font-semibold text-gray-600 dark:text-stone-300">{item.weight || "N/A"}</span></p>
                  </div>
                  <p className="font-serif text-base font-bold text-gold-600 dark:text-gold-400 mt-2">
                    {formatPrice(item.price)}
                  </p>
                </div>

                {/* Quantity Editor & Subtotal */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-4 sm:gap-2">
                  {/* Quantity selector buttons */}
                  <div className="flex items-center border border-gold-300/40 rounded-lg overflow-hidden bg-stone-50 dark:bg-stone-900">
                    <button
                      onClick={() => updateCartQty(item.id, item.quantity - 1)}
                      className="px-3 py-1.5 hover:bg-gold-500/10 text-luxury-black dark:text-gray-300 transition-colors font-bold text-sm cursor-pointer"
                    >
                      -
                    </button>
                    <span className="px-3 text-sm font-semibold text-luxury-black dark:text-white">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateCartQty(item.id, item.quantity + 1)}
                      className="px-3 py-1.5 hover:bg-gold-500/10 text-luxury-black dark:text-gray-300 transition-colors font-bold text-sm cursor-pointer"
                    >
                      +
                    </button>
                  </div>

                  {/* Remove & Price block */}
                  <div className="flex items-center gap-4">
                    <span className="font-serif font-bold text-luxury-black dark:text-stone-200 text-sm hidden sm:inline">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-gray-400 hover:text-red-500 p-2 transition-colors cursor-pointer"
                      title="Remove design"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Back action */}
            <div className="text-left pt-2">
              <Link
                to="/collections"
                className="text-xs font-semibold text-gold-600 dark:text-gold-400 hover:text-gold-500 uppercase tracking-widest"
              >
                &larr; Continue Shopping
              </Link>
            </div>
          </div>

          {/* 2. Right Column: Price Summary Panel */}
          <div className="lg:col-span-4">
            <div className="bg-white dark:bg-luxury-charcoal p-6 rounded-3xl border border-gold-100/50 dark:border-stone-850/40 shadow-sm space-y-6">
              <h3 className="font-serif text-xl font-bold text-luxury-black dark:text-white border-b border-gold-100/15 dark:border-stone-800/20 pb-4">
                Order Summary
              </h3>

              {/* Price rows */}
              <div className="space-y-3.5 text-sm font-light text-gray-600 dark:text-gray-300">
                <div className="flex justify-between">
                  <span>Bag Subtotal</span>
                  <span className="font-medium text-luxury-black dark:text-white">{formatPrice(cartSubtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST (3% Jewel Standard)</span>
                  <span className="font-medium text-luxury-black dark:text-white">{formatPrice(cartTax)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Insured Doorstep Delivery</span>
                  <span className="font-medium text-emerald-600 dark:text-emerald-400">
                    {deliveryFee === 0 ? "FREE" : formatPrice(deliveryFee)}
                  </span>
                </div>
                
                <div className="border-t border-gold-100/15 dark:border-stone-800/20 pt-4 flex justify-between font-serif text-lg font-bold text-luxury-black dark:text-white">
                  <span>Estimated Total</span>
                  <span className="text-gold-600 dark:text-gold-400">{formatPrice(cartTotal)}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <Link
                to="/checkout"
                className="w-full bg-gold-500 hover:bg-gold-600 text-stone-950 py-4 rounded-xl text-xs uppercase tracking-wider font-bold text-center block transition-all shadow-md hover:shadow-lg"
              >
                Proceed to Secure Checkout
              </Link>

              {/* Security info */}
              <div className="bg-stone-50 dark:bg-stone-900/40 p-4 rounded-xl text-[11px] text-gray-400 leading-relaxed font-light text-center border border-stone-100 dark:border-stone-850">
                🛡️ Secure 256-bit encrypted checkout. All shipments are fully insured against loss or damage in transit.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
