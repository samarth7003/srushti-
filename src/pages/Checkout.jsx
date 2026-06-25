import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { createOrder } from "../services/db";
import { uploadImage } from "../services/storage";
import { ShieldCheck, QrCode, CreditCard, ChevronRight, CheckCircle2 } from "lucide-react";

export const Checkout = ({ addToast }) => {
  const { cart, cartSubtotal, cartTax, deliveryFee, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  // Form Fields
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash On Delivery");

  // UPI Specific fields
  const [utrNumber, setUtrNumber] = useState("");
  const [screenshotFile, setScreenshotFile] = useState(null);
  const [screenshotPreview, setScreenshotPreview] = useState("");
  const [uploading, setUploading] = useState(false);

  // Success State
  const [orderCreated, setOrderCreated] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Format Price as INR
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(price);
  };

  // Generate real UPI Pay payload for QR code
  const upiId = "srushtijewellery@okaxis";
  const payeeName = "Srushti Jewellery";
  const upiPayload = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(
    payeeName
  )}&am=${cartTotal}&cu=INR`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
    upiPayload
  )}`;

  const handleScreenshotChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploading(true);
      try {
        const previewUrl = await uploadImage(file);
        setScreenshotPreview(previewUrl);
        addToast("Receipt uploaded successfully!", "success");
      } catch (err) {
        console.error("Screenshot upload failed", err);
        addToast("Failed to upload screenshot. Please try again.", "error");
      } finally {
        setUploading(false);
      }
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!name || !mobile || !address || !city || !pincode) {
      addToast("Please fill in all address and contact details.", "error");
      return;
    }
    
    if (mobile.length < 10) {
      addToast("Please enter a valid 10-digit mobile number.", "error");
      return;
    }

    if (pincode.length !== 6) {
      addToast("Please enter a valid 6-digit PIN code.", "error");
      return;
    }

    let paymentStatus = "Pending COD Delivery";
    let utr = "";
    let screenshot = "";

    if (paymentMethod === "Scan & Pay using UPI QR Code") {
      if (!utrNumber) {
        addToast("Please enter the 12-digit UTR/Transaction number.", "error");
        return;
      }
      if (utrNumber.length !== 12) {
        addToast("UTR/Transaction ID must be exactly 12 digits.", "error");
        return;
      }
      if (!screenshotPreview) {
        addToast("Please upload the payment transaction receipt/screenshot.", "error");
        return;
      }
      paymentStatus = "Pending Verification";
      utr = utrNumber;
      screenshot = screenshotPreview;
    }

    setSubmitting(true);
    try {
      const orderData = {
        customerName: name,
        mobile,
        address,
        city,
        pincode,
        paymentMethod,
        paymentStatus,
        items: cart,
        subtotal: cartSubtotal,
        tax: cartTax,
        delivery: deliveryFee,
        total: cartTotal,
        utr,
        screenshot
      };

      const result = await createOrder(orderData);
      setOrderCreated(result);
      clearCart();
      addToast("Order placed successfully!", "success");
    } catch (err) {
      console.error("Failed to place order", err);
      addToast("Failed to place order. Try again.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  // If order is successfully created, render Receipt view
  if (orderCreated) {
    return (
      <div className="bg-gold-50/20 dark:bg-luxury-black transition-colors duration-300 font-sans min-h-screen py-16 px-6 flex items-center justify-center">
        <div className="max-w-xl w-full bg-white dark:bg-luxury-charcoal p-8 rounded-3xl border border-gold-200/50 dark:border-stone-850/40 shadow-2xl space-y-6 text-center">
          <div className="flex justify-center text-gold-500 animate-scale-up">
            <CheckCircle2 size={64} className="stroke-[1.5]" />
          </div>
          
          <div className="space-y-2">
            <h2 className="font-serif text-3xl font-bold text-luxury-black dark:text-white">
              Order Placed Successfully!
            </h2>
            <p className="text-gray-500 text-xs font-light">
              Your order has been recorded. Srushti Jewellery boutique team is preparing your package.
            </p>
          </div>

          <div className="bg-stone-50 dark:bg-stone-900/40 p-5 rounded-2xl border border-gold-200/10 text-left text-sm space-y-3 font-light">
            <div className="flex justify-between border-b border-stone-200/40 pb-2">
              <span className="text-gray-400">Order Reference</span>
              <span className="font-bold text-luxury-black dark:text-white">{orderCreated.id}</span>
            </div>
            <div className="flex justify-between border-b border-stone-200/40 pb-2">
              <span className="text-gray-400">Customer Name</span>
              <span className="font-medium text-luxury-black dark:text-white">{orderCreated.customerName}</span>
            </div>
            <div className="flex justify-between border-b border-stone-200/40 pb-2">
              <span className="text-gray-400">Payment Status</span>
              <span className="font-medium text-gold-600 dark:text-gold-400">{orderCreated.paymentStatus}</span>
            </div>
            <div className="flex justify-between font-bold text-base pt-1 font-serif">
              <span className="text-gray-400">Total Charged</span>
              <span className="text-luxury-black dark:text-gold-300">{formatPrice(orderCreated.total)}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to={`/track-order?id=${orderCreated.id}`}
              className="w-full bg-gold-500 hover:bg-gold-600 text-stone-950 py-3.5 rounded-xl text-xs uppercase tracking-wider font-bold transition-all shadow-md"
            >
              Track Order Status
            </Link>
            <Link
              to="/"
              className="w-full border border-gold-400/40 text-gold-600 dark:text-gold-400 hover:bg-gold-500/10 py-3.5 rounded-xl text-xs uppercase tracking-wider font-bold transition-all"
            >
              Return to Homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Guard checkout page when cart is empty
  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 text-center font-sans">
        <h2 className="font-serif text-3xl font-bold text-luxury-black dark:text-white">
          Access Denied
        </h2>
        <p className="text-gray-500 mt-2 mb-6 text-sm font-light">
          Your cart is currently empty. Add products before checking out.
        </p>
        <Link
          to="/collections"
          className="bg-gold-500 text-stone-950 px-8 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider"
        >
          Explore Collections
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gold-50/20 dark:bg-luxury-black transition-colors duration-300 font-sans min-h-screen py-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="text-left mb-10 space-y-2">
          <h1 className="font-serif text-4xl font-light text-luxury-black dark:text-gold-200">
            Secure Checkout
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-light">
            Fill in your delivery address and choose your preferred luxury checkout options.
          </p>
        </div>

        {/* Form Grid split layout */}
        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left panel: Form details & Payment options */}
          <div className="lg:col-span-8 space-y-8 text-left">
            {/* Shipping details */}
            <div className="bg-white dark:bg-luxury-charcoal p-6 rounded-2xl border border-gold-100/50 dark:border-stone-850/40 shadow-sm space-y-4">
              <h3 className="font-serif text-xl font-bold text-luxury-black dark:text-white border-b border-gold-100/15 dark:border-stone-800/20 pb-3">
                1. Delivery & Contact Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="E.g., Aarav Mehta"
                    className="w-full bg-stone-50 dark:bg-stone-900 border border-gold-200/50 dark:border-stone-800 rounded-xl p-3 text-sm focus:outline-none focus:border-gold-500 text-luxury-black dark:text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
                    placeholder="10-digit mobile number"
                    className="w-full bg-stone-50 dark:bg-stone-900 border border-gold-200/50 dark:border-stone-800 rounded-xl p-3 text-sm focus:outline-none focus:border-gold-500 text-luxury-black dark:text-white"
                  />
                </div>
                <div className="md:col-span-2 space-y-1">
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                    Street Address
                  </label>
                  <textarea
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="House, apartment, suite number, street details..."
                    className="w-full bg-stone-50 dark:bg-stone-900 border border-gold-200/50 dark:border-stone-800 rounded-xl p-3 text-sm focus:outline-none focus:border-gold-500 text-luxury-black dark:text-white min-h-[80px]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                    City / Region
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="E.g., Bangalore"
                    className="w-full bg-stone-50 dark:bg-stone-900 border border-gold-200/50 dark:border-stone-800 rounded-xl p-3 text-sm focus:outline-none focus:border-gold-500 text-luxury-black dark:text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                    Pincode
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
                    placeholder="6-digit ZIP / PIN"
                    className="w-full bg-stone-50 dark:bg-stone-900 border border-gold-200/50 dark:border-stone-800 rounded-xl p-3 text-sm focus:outline-none focus:border-gold-500 text-luxury-black dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Details */}
            <div className="bg-white dark:bg-luxury-charcoal p-6 rounded-2xl border border-gold-100/50 dark:border-stone-850/40 shadow-sm space-y-6">
              <h3 className="font-serif text-xl font-bold text-luxury-black dark:text-white border-b border-gold-100/15 dark:border-stone-800/20 pb-3">
                2. Select Luxury Payment Method
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Option 1: COD */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod("Cash On Delivery")}
                  className={`p-4 rounded-xl border-2 text-left flex items-start gap-3 transition-all ${
                    paymentMethod === "Cash On Delivery"
                      ? "border-gold-500 bg-gold-50/20"
                      : "border-gold-100/40 dark:border-stone-850 hover:border-gold-300"
                  }`}
                >
                  <CreditCard className="text-gold-500 mt-1 shrink-0" />
                  <div>
                    <h4 className="font-semibold text-sm text-luxury-black dark:text-white">Cash On Delivery</h4>
                    <p className="text-[11px] text-gray-400 mt-1 font-light leading-relaxed">
                      Pay cash at the time of delivery. Safe & simple.
                    </p>
                  </div>
                </button>

                {/* Option 2: UPI */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod("Scan & Pay using UPI QR Code")}
                  className={`p-4 rounded-xl border-2 text-left flex items-start gap-3 transition-all ${
                    paymentMethod === "Scan & Pay using UPI QR Code"
                      ? "border-gold-500 bg-gold-50/20"
                      : "border-gold-100/40 dark:border-stone-850 hover:border-gold-300"
                  }`}
                >
                  <QrCode className="text-gold-500 mt-1 shrink-0" />
                  <div>
                    <h4 className="font-semibold text-sm text-luxury-black dark:text-white">Scan & Pay (UPI QR)</h4>
                    <p className="text-[11px] text-gray-400 mt-1 font-light leading-relaxed">
                      Secure mobile payment. Scan, pay, upload receipt for fast confirmations.
                    </p>
                  </div>
                </button>
              </div>

              {/* UPI Form Extension */}
              {paymentMethod === "Scan & Pay using UPI QR Code" && (
                <div className="bg-stone-50 dark:bg-stone-900/60 p-6 rounded-2xl border border-gold-200/20 space-y-6 animate-slide-up">
                  <div className="flex flex-col md:flex-row items-center gap-6">
                    {/* QR Code */}
                    <div className="bg-white p-3.5 rounded-xl shadow-md border border-gold-200/20 shrink-0">
                      <img src={qrCodeUrl} alt="UPI QR Code" className="w-40 h-40" />
                      <p className="text-[9px] text-stone-500 font-bold uppercase tracking-widest text-center mt-2">
                        Scan to Pay
                      </p>
                    </div>

                    <div className="text-left space-y-3 font-light text-xs">
                      <h4 className="font-serif text-sm font-bold text-luxury-black dark:text-white">
                        Scan with your UPI App
                      </h4>
                      <p className="text-gray-500 leading-relaxed">
                        Scan the QR code with GPay, PhonePe, Paytm, or BHIM. The exact order total of{" "}
                        <span className="font-bold text-luxury-black dark:text-gold-400">{formatPrice(cartTotal)}</span> will be auto-filled.
                      </p>
                      <div>
                        <span className="text-gray-400 block font-light">Payee UPI ID:</span>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="font-bold text-stone-950 dark:text-white text-xs select-all bg-stone-100/50 dark:bg-stone-950 border border-gold-250/20 px-2.5 py-1.5 rounded-lg font-mono">
                            {upiId}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(upiId);
                              addToast("Payee UPI ID copied to clipboard!", "success");
                            }}
                            className="bg-gold-500 hover:bg-gold-600 text-stone-950 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
                          >
                            Copy
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* UTR Input */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-gray-500 uppercase">
                        UTR / Transaction ID (12 Digits)
                      </label>
                      <input
                        type="text"
                        maxLength={12}
                        value={utrNumber}
                        onChange={(e) => setUtrNumber(e.target.value.replace(/\D/g, ""))}
                        placeholder="E.g., 628394857182"
                        className="w-full bg-white dark:bg-stone-950 border border-gold-200/50 dark:border-stone-800 rounded-xl p-3 text-sm focus:outline-none focus:border-gold-500 text-luxury-black dark:text-white font-medium"
                      />
                    </div>

                    {/* Screenshot Upload */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-gray-500 uppercase">
                        Upload Transaction Screenshot
                      </label>
                      <div className="relative">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleScreenshotChange}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <div className="bg-white dark:bg-stone-950 border border-dashed border-gold-300/60 dark:border-stone-800 rounded-xl p-3 text-sm text-center text-gray-400 font-semibold hover:border-gold-500 transition-all flex items-center justify-center min-h-[46px]">
                          {uploading ? "Uploading..." : screenshotPreview ? "Change Image" : "Choose File"}
                        </div>
                      </div>
                    </div>

                    {/* Image Preview */}
                    {screenshotPreview && (
                      <div className="md:col-span-2 flex justify-center border border-gold-100/10 p-2 rounded-xl bg-white dark:bg-stone-950">
                        <img
                          src={screenshotPreview}
                          alt="Receipt Preview"
                          className="max-h-40 rounded-lg object-contain"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right panel: Summary checkout items */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white dark:bg-luxury-charcoal p-6 rounded-3xl border border-gold-100/50 dark:border-stone-850/40 shadow-sm space-y-6">
              <h3 className="font-serif text-xl font-bold text-luxury-black dark:text-white border-b border-gold-100/15 dark:border-stone-800/20 pb-4">
                Review Your Order
              </h3>

              {/* Items checklist */}
              <div className="space-y-4 max-h-60 overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-3 text-left">
                    <div className="w-12 h-12 rounded bg-stone-50 dark:bg-stone-950 overflow-hidden shrink-0 border border-gold-200/10">
                      <ProductImage src={item.images?.[0]} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-grow text-xs min-w-0">
                      <h4 className="font-serif font-bold text-luxury-black dark:text-stone-200 truncate">
                        {item.name}
                      </h4>
                      <p className="text-gray-400 mt-0.5">
                        Qty: {item.quantity} &bull; {item.material}
                      </p>
                    </div>
                    <span className="font-serif text-xs font-semibold text-luxury-black dark:text-gold-300">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Total calculations */}
              <div className="border-t border-gold-100/15 dark:border-stone-800/20 pt-4 space-y-3 text-xs text-gray-500 font-light">
                <div className="flex justify-between">
                  <span>Bag Subtotal</span>
                  <span className="font-medium text-luxury-black dark:text-white">{formatPrice(cartSubtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST (3% Jewel Standard)</span>
                  <span className="font-medium text-luxury-black dark:text-white">{formatPrice(cartTax)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Insured Delivery</span>
                  <span className="font-medium text-emerald-600 dark:text-emerald-400">
                    {deliveryFee === 0 ? "FREE" : formatPrice(deliveryFee)}
                  </span>
                </div>
                <div className="border-t border-gold-100/15 dark:border-stone-800/20 pt-3 flex justify-between font-serif text-lg font-bold text-luxury-black dark:text-white">
                  <span>Payable Total</span>
                  <span className="text-gold-600 dark:text-gold-400">{formatPrice(cartTotal)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-gold-500 hover:bg-gold-600 disabled:bg-gold-200/50 text-stone-950 font-bold uppercase tracking-wider py-4 rounded-xl text-xs transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
              >
                {submitting ? "Processing Order..." : "Place Order Securely"}
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
                <ShieldCheck size={14} className="text-emerald-500" /> Secure SSL Server
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
