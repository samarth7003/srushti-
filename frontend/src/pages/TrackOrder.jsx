import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { getOrders } from "../services/orderApi";
import { ProductImage } from "../components/ProductImage";
import { Search, Clock, CheckCircle2, Package, Truck, Smile, ShieldAlert } from "lucide-react";

export const TrackOrder = () => {
  const [searchParams] = useSearchParams();
  const [orderQuery, setOrderQuery] = useState("");
  const [matchedOrders, setMatchedOrders] = useState([]);
  const [searched, setSearched] = useState(false);

  // Status timeline parameters
  const statuses = ["Order Placed", "Confirmed", "Packed", "Shipped", "Delivered"];

  const getStatusIcon = (status) => {
    switch (status) {
      case "Order Placed":
        return <Clock size={20} />;
      case "Confirmed":
        return <CheckCircle2 size={20} />;
      case "Packed":
        return <Package size={20} />;
      case "Shipped":
        return <Truck size={20} />;
      case "Delivered":
        return <Smile size={20} />;
      default:
        return <Clock size={20} />;
    }
  };

  // Check URL params on mount
  useEffect(() => {
    const urlId = searchParams.get("id");
    if (urlId) {
      setOrderQuery(urlId);
      performSearch(urlId);
    }
  }, [searchParams]);

  const performSearch = async (query) => {
    if (!query.trim()) return;
    setSearched(true);
    try {
      const allOrders = await getOrders();
      const q = query.toUpperCase().trim();
      
      // Match by exact Order ID or Mobile Number
      const results = allOrders.filter(
        (o) => o.id.toUpperCase() === q || o.mobile === q
      );
      setMatchedOrders(results);
    } catch (err) {
      console.error("Error fetching order tracking", err);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    performSearch(orderQuery);
  };

  const getStatusIndex = (currentStatus) => {
    return statuses.indexOf(currentStatus);
  };

  return (
    <div className="bg-gold-50/20 dark:bg-luxury-black transition-colors duration-300 font-sans min-h-screen py-12 px-6">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Page Header */}
        <div className="text-left space-y-2">
          <h1 className="font-serif text-4xl font-light text-luxury-black dark:text-gold-200">
            Track Your Order
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-light">
            Enter your Order ID (found on your invoice) or billing Mobile Number to track delivery progress.
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="bg-white dark:bg-luxury-charcoal p-5 rounded-2xl border border-gold-100/50 dark:border-stone-850/40 shadow-sm flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative w-full">
            <input
              type="text"
              required
              value={orderQuery}
              onChange={(e) => setOrderQuery(e.target.value)}
              placeholder="Enter Order ID (e.g. ORD-9832) or Mobile Number"
              className="w-full bg-stone-50 dark:bg-stone-900 border border-gold-200/50 dark:border-stone-850 rounded-xl p-4 text-sm focus:outline-none focus:border-gold-500 text-luxury-black dark:text-white"
            />
            <Search size={18} className="absolute right-4 top-4.5 text-gray-400" />
          </div>
          <button
            type="submit"
            className="w-full sm:w-auto bg-gold-500 hover:bg-gold-600 text-stone-950 px-8 py-4 rounded-xl text-xs uppercase tracking-wider font-bold transition-all shadow-md shrink-0 cursor-pointer"
          >
            Track Status
          </button>
        </form>

        {/* Search Results */}
        {searched && matchedOrders.length === 0 && (
          <div className="bg-white dark:bg-luxury-charcoal p-10 rounded-2xl border border-gold-100/40 text-center space-y-4">
            <ShieldAlert className="text-amber-500 mx-auto" size={40} />
            <h3 className="font-serif text-2xl font-bold text-luxury-black dark:text-white">
              No Orders Found
            </h3>
            <p className="text-gray-500 text-sm font-light max-w-sm mx-auto leading-relaxed">
              We couldn't locate any active orders matching "{orderQuery}". Please double check your order receipt or contact Srushti customer concierge.
            </p>
          </div>
        )}

        {searched && matchedOrders.map((order) => {
          const activeIndex = getStatusIndex(order.orderStatus);
          
          return (
            <div key={order.id} className="bg-white dark:bg-luxury-charcoal rounded-3xl border border-gold-200/50 dark:border-stone-850/40 shadow-md p-6 sm:p-8 space-y-8 text-left">
              {/* Receipt Header details */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gold-100/10 pb-5">
                <div>
                  <span className="text-[10px] text-gray-400 uppercase tracking-widest block font-medium">Order Reference</span>
                  <span className="font-serif text-xl font-bold text-luxury-black dark:text-white">{order.id}</span>
                </div>
                <div className="text-left sm:text-right">
                  <span className="text-[10px] text-gray-400 uppercase tracking-widest block font-medium">Order Date</span>
                  <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                    {new Date(order.date).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric"
                    })}
                  </span>
                </div>
              </div>

              {/* TIMELINE PATHWAY */}
              <div className="space-y-4">
                <h4 className="font-serif text-base font-bold text-luxury-black dark:text-gold-200 uppercase tracking-wider">
                  Shipment Timeline
                </h4>
                
                {/* Visual line pathway container */}
                <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-2 pt-4 pb-8">
                  {/* Connect Line - Desktop */}
                  <div className="hidden md:block absolute top-[38px] left-10 right-10 h-0.5 bg-stone-200 dark:bg-stone-850 z-0">
                    <div
                      className="h-full bg-gold-500 transition-all duration-500"
                      style={{ width: `${(activeIndex / (statuses.length - 1)) * 100}%` }}
                    />
                  </div>

                  {statuses.map((status, index) => {
                    const isCompleted = index <= activeIndex;
                    const isActive = index === activeIndex;

                    return (
                      <div
                        key={status}
                        className="relative z-10 flex md:flex-col items-center gap-4 md:gap-2 text-left md:text-center w-full md:w-1/5"
                      >
                        {/* Icon Node */}
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                            isActive
                              ? "bg-gold-500 text-stone-950 border-gold-500 shadow-[0_0_10px_rgba(212,184,132,0.6)] animate-pulse"
                              : isCompleted
                              ? "bg-stone-900 dark:bg-gold-50 text-white dark:text-stone-950 border-stone-900 dark:border-gold-50"
                              : "bg-white dark:bg-stone-900 text-gray-300 dark:text-stone-700 border-gray-200 dark:border-stone-800"
                          }`}
                        >
                          {getStatusIcon(status)}
                        </div>

                        {/* Text labels */}
                        <div>
                          <p
                            className={`text-xs font-bold ${
                              isCompleted
                                ? "text-luxury-black dark:text-white"
                                : "text-gray-400 dark:text-stone-700"
                            }`}
                          >
                            {status}
                          </p>
                          {isActive && (
                            <span className="text-[9px] uppercase font-bold tracking-widest text-gold-500 block mt-0.5">
                              Current Stage
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Order Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-gold-100/10">
                {/* 1. Item Details */}
                <div className="space-y-4">
                  <h4 className="font-serif text-base font-bold text-luxury-black dark:text-gold-200 uppercase tracking-wider">
                    Package Contents
                  </h4>
                  <div className="space-y-3">
                    {order.items?.map((item) => (
                      <div key={item.id} className="flex gap-3 text-left">
                        <div className="w-12 h-12 rounded bg-stone-50 dark:bg-stone-950 overflow-hidden shrink-0 border border-gold-200/10">
                          <ProductImage src={item.images?.[0]} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-grow text-xs min-w-0">
                          <h5 className="font-serif font-bold text-luxury-black dark:text-stone-200 truncate">
                            {item.name}
                          </h5>
                          <p className="text-gray-400 mt-0.5">
                            Qty: {item.quantity} &bull; {item.material}
                          </p>
                        </div>
                        <span className="font-serif text-xs font-semibold text-luxury-black dark:text-gold-300">
                          {new Intl.NumberFormat("en-IN", {
                            style: "currency",
                            currency: "INR",
                            maximumFractionDigits: 0
                          }).format(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. Customer Delivery Info */}
                <div className="space-y-3 font-light text-xs leading-relaxed">
                  <h4 className="font-serif text-base font-bold text-luxury-black dark:text-gold-200 uppercase tracking-wider">
                    Delivery Address
                  </h4>
                  <div className="space-y-1 text-gray-600 dark:text-gray-300">
                    <p className="font-semibold text-luxury-black dark:text-white text-sm">{order.customerName}</p>
                    <p>Contact Mobile: {order.mobile}</p>
                    <p>{order.address}</p>
                    <p>{order.city} - {order.pincode}</p>
                    <p className="pt-2">
                      Payment Mode: <span className="font-semibold">{order.paymentMethod}</span>
                    </p>
                    <p>
                      Payment Status: <span className="font-bold text-gold-600 dark:text-gold-400">{order.paymentStatus}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
