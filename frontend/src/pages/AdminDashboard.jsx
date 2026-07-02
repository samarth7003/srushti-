import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getProducts, addProduct, updateProduct, deleteProduct } from "../services/productApi";
import { getOrders, updateOrderStatus, approveUpiPayment } from "../services/orderApi";
import { getCategories, addCategory, deleteCategory } from "../services/categoryApi";
import { uploadImage } from "../services/storage";
import {
  TrendingUp,
  ShoppingBag,
  AlertTriangle,
  Plus,
  Trash2,
  Edit3,
  DollarSign,
  Search,
  CheckCircle,
  Truck,
  X,
  Lock,
  ChevronRight,
  Eye,
  EyeOff
} from "lucide-react";
import { LogoIcon } from "../components/LogoIcon";

export const AdminDashboard = ({ addToast }) => {
  const { user, isAdmin, login, logout } = useAuth();
  
  // Login states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);

  // Dashboard state tabs
  const [activeTab, setActiveTab] = useState("analytics");
  
  // Products states
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit / Add product states
  const [showProductModal, setShowProductModal] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // "add" or "edit"
  const [currentProductId, setCurrentProductId] = useState("");
  const [pName, setPName] = useState("");
  const [pDesc, setPDesc] = useState("");
  const [pPrice, setPPrice] = useState("");
  const [pCat, setPCat] = useState("");
  const [pMat, setPMat] = useState("");
  const [pWeight, setPWeight] = useState("");
  const [pStock, setPStock] = useState("");
  const [pImages, setPImages] = useState([]);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Category management state
  const [newCatName, setNewCatName] = useState("");

  // Orders searching
  const [orderQuery, setOrderQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Fetch Dashboard Data
  const loadDashboardData = async () => {
    if (!isAdmin) return;
    setLoading(true);
    try {
      const dbProducts = await getProducts();
      const dbOrders = await getOrders();
      const dbCategories = await getCategories();
      setProducts(dbProducts);
      setOrders(dbOrders);
      setCategories(dbCategories);
      if (dbCategories.length > 0 && !pCat) {
        setPCat(dbCategories[0]);
      }
    } catch (err) {
      console.error("Failed to load admin dashboard data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [isAdmin]);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    try {
      await login(email, password);
      addToast("Welcome back Srushti Boutique Admin!", "success");
    } catch (err) {
      addToast(err.message, "error");
    } finally {
      setLoginLoading(false);
    }
  };

  // Product CRUD
  const handleOpenAddModal = () => {
    setModalMode("add");
    setCurrentProductId("");
    setPName("");
    setPDesc("");
    setPPrice("");
    setPCat(categories[0] || "");
    setPMat("22K Gold");
    setPWeight("10g");
    setPStock("10");
    setPImages([]);
    setShowProductModal(true);
  };

  const handleOpenEditModal = (product) => {
    setModalMode("edit");
    setCurrentProductId(product.id);
    setPName(product.name);
    setPDesc(product.description);
    setPPrice(product.price.toString());
    setPCat(product.category);
    setPMat(product.material);
    setPWeight(product.weight);
    setPStock(product.stock.toString());
    setPImages(product.images || []);
    setShowProductModal(true);
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    setUploadingImage(true);
    try {
      const uploadPromises = files.map((file) => uploadImage(file));
      const urls = await Promise.all(uploadPromises);
      setPImages((prev) => [...prev, ...urls]);
      addToast("Images uploaded successfully!", "success");
    } catch (err) {
      console.error(err);
      addToast("Failed to upload product images.", "error");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!pName || !pPrice || !pStock) {
      addToast("Name, price, and stock quantities are required.", "error");
      return;
    }

    const payload = {
      name: pName,
      description: pDesc,
      price: parseInt(pPrice),
      category: pCat,
      material: pMat,
      weight: pWeight,
      stock: parseInt(pStock),
      availability: parseInt(pStock) > 0 ? "In Stock" : "Out of Stock",
      images: pImages.length > 0 ? pImages : ["/images/products/necklace-1.svg"]
    };

    try {
      if (modalMode === "add") {
        await addProduct(payload);
        addToast("Product added to catalog!", "success");
      } else {
        await updateProduct({ id: currentProductId, ...payload });
        addToast("Product details updated!", "success");
      }
      setShowProductModal(false);
      await loadDashboardData();
    } catch (err) {
      addToast("Failed to save product details.", "error");
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(id);
        addToast("Product removed from catalog.", "info");
        await loadDashboardData();
      } catch (err) {
        addToast("Delete operation failed.", "error");
      }
    }
  };

  // Categories triggers
  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    try {
      await addCategory(newCatName.trim());
      addToast(`Category ${newCatName} added!`, "success");
      setNewCatName("");
      await loadDashboardData();
    } catch (err) {
      addToast("Add category failed.", "error");
    }
  };

  const handleDeleteCategory = async (cat) => {
    if (window.confirm(`Are you sure you want to delete category "${cat}"?`)) {
      try {
        await deleteCategory(cat);
        addToast(`Category deleted.`, "info");
        await loadDashboardData();
      } catch (err) {
        addToast("Delete category failed.", "error");
      }
    }
  };

  // Orders Actions
  const handleUpdateStatus = async (orderId, status) => {
    try {
      const updated = await updateOrderStatus(orderId, status);
      addToast(`Order ${orderId} status set to: ${status}`, "success");
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(updated);
      }
      await loadDashboardData();
    } catch (err) {
      addToast("Failed to update status", "error");
    }
  };

  const handleApproveUPI = async (orderId) => {
    try {
      const updated = await approveUpiPayment(orderId);
      addToast(`UPI Payment for order ${orderId} verified and approved!`, "success");
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(updated);
      }
      await loadDashboardData();
    } catch (err) {
      addToast("Failed to approve UPI", "error");
    }
  };

  // Search/Filter Orders
  const getFilteredOrders = () => {
    if (!orderQuery.trim()) return orders;
    const q = orderQuery.toLowerCase().trim();
    return orders.filter(
      (o) =>
        o.id.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.mobile.includes(q)
    );
  };

  const filteredOrders = getFilteredOrders();

  // Low stock alerts list
  const lowStockProducts = products.filter((p) => p.stock <= 5);

  // Sales Math
  const totalRevenue = orders
    .filter((o) => o.paymentStatus === "Paid" || o.paymentMethod === "Cash On Delivery")
    .reduce((sum, o) => sum + o.total, 0);

  const averageTicket = orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0;

  // Format Price as INR
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(price);
  };

  // If user is not admin, show premium login screen
  if (!isAdmin) {
    return (
      <div className="bg-gold-50/20 dark:bg-luxury-black transition-colors duration-300 font-sans min-h-screen py-20 px-6 flex items-center justify-center">
        <div className="max-w-md w-full bg-white dark:bg-luxury-charcoal p-8 rounded-3xl border border-gold-200/50 dark:border-stone-850/40 shadow-2xl space-y-6 text-center">
          {/* Brand Logo Header */}
          <div className="flex flex-col items-center select-none">
            <LogoIcon className="w-12 h-12 text-gold-500 mb-2" />
            <span className="font-serif text-2xl font-bold tracking-widest text-luxury-black dark:text-gold-200 leading-none">
              SRUSHTI
            </span>
            <span className="text-[9px] tracking-[0.3em] font-light text-gold-600 dark:text-gold-400 mt-1">
              JEWELLERY
            </span>
          </div>

          <div className="space-y-2">
            <h1 className="font-serif text-2xl font-bold text-luxury-black dark:text-white">
              Admin Boutique Login
            </h1>
            <p className="text-gray-400 text-xs font-light">
              Enter admin keys to access catalog parameters and order shipping timelines.
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4 text-left">
            <div className="space-y-1">
              <label className="text-[10px] font-semibold text-gray-500 uppercase">Admin Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@srushti.com"
                className="w-full bg-stone-50 dark:bg-stone-900 border border-gold-200/50 dark:border-stone-800 rounded-xl p-3 text-sm focus:outline-none focus:border-gold-500 text-luxury-black dark:text-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-semibold text-gray-500 uppercase">Access Password</label>
              <div className="relative">
                <input
                  type={showAdminPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-stone-50 dark:bg-stone-900 border border-gold-200/50 dark:border-stone-800 rounded-xl p-3 pr-10 text-sm focus:outline-none focus:border-gold-500 text-luxury-black dark:text-white"
                />
                <button
                  type="button"
                  onClick={() => setShowAdminPassword(!showAdminPassword)}
                  className="absolute right-3 top-3.5 text-gray-400 hover:text-gold-500 transition-colors"
                >
                  {showAdminPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full bg-gold-500 hover:bg-gold-600 disabled:bg-gold-200 text-stone-950 font-bold uppercase tracking-wider py-4 rounded-xl text-xs transition-all shadow-md flex items-center justify-center cursor-pointer"
            >
              {loginLoading ? "Verifying Keys..." : "Access Dashboard"}
            </button>
          </form>

          {/* Quick instructions details */}
          <div className="bg-stone-50 dark:bg-stone-900/60 p-4 rounded-xl text-[10px] text-gray-400 font-light border border-stone-200/10">
            🔐 Developer Preview Bypass credentials: <br />
            Email: <span className="font-bold text-luxury-black dark:text-white select-all">admin@srushti.com</span> &bull; Password: <span className="font-bold text-luxury-black dark:text-white select-all">admin</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gold-50/20 dark:bg-luxury-black transition-colors duration-300 font-sans min-h-screen py-10 px-6 text-left">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gold-100/10 pb-6">
          <div className="space-y-1">
            <h1 className="font-serif text-3xl font-bold text-luxury-black dark:text-gold-200">
              Admin Command Center
            </h1>
            <p className="text-xs text-gray-500 font-light">
              Operational review controls for Srushti Jewellery flagship boutique.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleOpenAddModal}
              className="bg-gold-500 hover:bg-gold-600 text-stone-950 px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider font-bold shadow-md flex items-center gap-1 cursor-pointer"
            >
              <Plus size={14} /> Add Product
            </button>
            <button
              onClick={logout}
              className="border border-red-500/30 text-red-500 hover:bg-red-500/10 px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider font-bold transition-all cursor-pointer"
            >
              Logout Dashboard
            </button>
          </div>
        </div>

        {/* Tab switcher navigation */}
        <div className="flex border-b border-gold-200/20 text-xs font-semibold uppercase tracking-wider space-x-6 overflow-x-auto pb-1">
          {[
            { id: "analytics", label: "Sales Analytics" },
            { id: "orders", label: "Manage Orders" },
            { id: "inventory", label: "Inventory Catalog" },
            { id: "categories", label: "Product Categories" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 font-semibold transition-all relative cursor-pointer ${
                activeTab === tab.id
                  ? "text-gold-500 font-bold"
                  : "text-gray-400 hover:text-gray-600 dark:hover:text-white"
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold-500"></span>
              )}
            </button>
          ))}
        </div>

        {/* Tab panel rendering */}
        {loading ? (
          <div className="h-60 bg-white dark:bg-luxury-charcoal rounded-3xl animate-pulse"></div>
        ) : (
          <div className="space-y-6">
            {/* TAB 1: ANALYTICS PANEL */}
            {activeTab === "analytics" && (
              <div className="space-y-8 animate-fade-in">
                {/* Stats row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white dark:bg-luxury-charcoal p-6 rounded-3xl border border-gold-100/50 dark:border-stone-850/40 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-2xl">
                      <TrendingUp size={28} />
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-400 uppercase tracking-widest block font-medium">Gross Revenue</span>
                      <span className="font-serif text-2xl font-bold text-luxury-black dark:text-white">
                        {formatPrice(totalRevenue)}
                      </span>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-luxury-charcoal p-6 rounded-3xl border border-gold-100/50 dark:border-stone-850/40 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-gold-500/10 text-gold-500 rounded-2xl">
                      <ShoppingBag size={28} />
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-400 uppercase tracking-widest block font-medium">Total Orders Placed</span>
                      <span className="font-serif text-2xl font-bold text-luxury-black dark:text-white">
                        {orders.length} orders
                      </span>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-luxury-charcoal p-6 rounded-3xl border border-gold-100/50 dark:border-stone-850/40 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-2xl">
                      <DollarSign size={28} />
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-400 uppercase tracking-widest block font-medium">Average Order Ticket</span>
                      <span className="font-serif text-2xl font-bold text-luxury-black dark:text-white">
                        {formatPrice(averageTicket)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Low Stock Alerts Section */}
                <div className="bg-white dark:bg-luxury-charcoal rounded-3xl border border-gold-200/50 dark:border-stone-850/40 shadow-md p-6">
                  <h3 className="font-serif text-lg font-bold text-luxury-black dark:text-white border-b border-gold-100/15 dark:border-stone-800/20 pb-4 mb-4 flex items-center gap-2">
                    <AlertTriangle className="text-amber-500 animate-bounce" size={20} /> Stock Alerts (Under 5 pieces)
                  </h3>
                  
                  {lowStockProducts.length === 0 ? (
                    <p className="text-sm text-gray-400 font-light py-4 text-center">
                      Good inventory status. No products are currently running low on stock.
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {lowStockProducts.map((p) => (
                        <div
                          key={p.id}
                          className="flex items-center justify-between p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10"
                        >
                          <div className="space-y-0.5">
                            <h4 className="font-serif font-bold text-sm text-luxury-black dark:text-white truncate max-w-xs">
                              {p.name}
                            </h4>
                            <p className="text-[10px] text-gray-400">
                              Category: {p.category} &bull; Code: {p.id}
                            </p>
                          </div>
                          <span className="bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 text-xs font-bold px-3 py-1 rounded-full shrink-0">
                            {p.stock} units left
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: MANAGE ORDERS PANEL */}
            {activeTab === "orders" && (
              <div className="space-y-6 animate-fade-in">
                {/* Search orders */}
                <div className="bg-white dark:bg-luxury-charcoal p-4 rounded-2xl border border-gold-100/50 dark:border-stone-850/40 shadow-sm flex items-center relative max-w-md">
                  <input
                    type="text"
                    value={orderQuery}
                    onChange={(e) => setOrderQuery(e.target.value)}
                    placeholder="Search orders by name, mobile, reference..."
                    className="w-full bg-stone-50 dark:bg-stone-900 border border-gold-100/60 dark:border-stone-800 text-sm rounded-xl py-2 pl-4 pr-10 focus:outline-none focus:border-gold-500 font-light text-luxury-black dark:text-white"
                  />
                  <Search size={16} className="absolute right-7 top-5.5 text-gray-400" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Left Column: Orders list table/grid */}
                  <div className="lg:col-span-6 bg-white dark:bg-luxury-charcoal border border-gold-200/50 dark:border-stone-850/40 rounded-3xl overflow-hidden shadow-sm">
                    <div className="bg-stone-50 dark:bg-stone-900/40 p-4 border-b border-gold-100/10 font-serif font-bold text-sm text-luxury-black dark:text-gold-200">
                      Boutique Placed Orders ({filteredOrders.length})
                    </div>
                    
                    <div className="divide-y divide-stone-100 dark:divide-stone-900 overflow-y-auto max-h-[500px]">
                      {filteredOrders.length === 0 ? (
                        <p className="text-sm text-gray-400 font-light py-12 text-center">
                          No boutique orders currently recorded.
                        </p>
                      ) : (
                        filteredOrders.map((ord) => (
                          <button
                            key={ord.id}
                            type="button"
                            onClick={() => setSelectedOrder(ord)}
                            className={`w-full p-4 flex justify-between items-center text-left hover:bg-stone-50 dark:hover:bg-stone-900/40 transition-colors ${
                              selectedOrder?.id === ord.id ? "bg-gold-50/15 dark:bg-stone-900/60" : ""
                            }`}
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-serif font-bold text-sm text-luxury-black dark:text-white">
                                  {ord.id}
                                </span>
                                <span className="text-[10px] text-gray-400 font-semibold uppercase">
                                  {ord.customerName}
                                </span>
                              </div>
                              <p className="text-[10px] text-gray-400">
                                {new Date(ord.date).toLocaleDateString("en-IN")} &bull; {ord.paymentMethod}
                              </p>
                              <div className="flex gap-2 pt-1">
                                <span className="bg-gold-50 dark:bg-stone-950 border border-gold-200/20 text-[9px] font-bold text-gold-600 dark:text-gold-400 px-2 py-0.5 rounded">
                                  {ord.orderStatus}
                                </span>
                                <span className="bg-stone-900 text-gold-200 dark:bg-stone-950 text-[9px] font-medium px-2 py-0.5 rounded">
                                  {ord.paymentStatus}
                                </span>
                              </div>
                            </div>
                            <div className="text-right flex items-center gap-2 shrink-0">
                              <span className="font-serif text-sm font-bold text-luxury-black dark:text-white">
                                {formatPrice(ord.total)}
                              </span>
                              <ChevronRight size={14} className="text-gray-400" />
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Right Column: Order Detail View Panel */}
                  <div className="lg:col-span-6">
                    {selectedOrder ? (
                      <div className="bg-white dark:bg-luxury-charcoal border border-gold-200/50 dark:border-stone-850/40 rounded-3xl p-6 shadow-md space-y-6 text-xs leading-relaxed font-light">
                        {/* Summary details */}
                        <div className="flex justify-between items-center border-b border-stone-100 dark:border-stone-900/40 pb-4">
                          <div>
                            <h4 className="font-serif text-lg font-bold text-luxury-black dark:text-white">
                              Order Details: {selectedOrder.id}
                            </h4>
                            <p className="text-[10px] text-gray-400">
                              Placed on: {new Date(selectedOrder.date).toLocaleString("en-IN")}
                            </p>
                          </div>
                          
                          <button
                            onClick={() => setSelectedOrder(null)}
                            className="p-1.5 hover:bg-stone-100 dark:hover:bg-stone-900 rounded-lg text-gray-400 hover:text-white"
                          >
                            <X size={16} />
                          </button>
                        </div>

                        {/* Customer block */}
                        <div className="space-y-1">
                          <h5 className="font-serif font-bold text-luxury-black dark:text-gold-200 uppercase tracking-widest text-[10px]">
                            Patron Delivery Details
                          </h5>
                          <p className="font-semibold text-luxury-black dark:text-white text-sm">
                            {selectedOrder.customerName} &bull; {selectedOrder.mobile}
                          </p>
                          <p className="text-gray-600 dark:text-gray-400 font-light">
                            {selectedOrder.address}, {selectedOrder.city} - {selectedOrder.pincode}
                          </p>
                        </div>

                        {/* Order status dashboard modifications */}
                        <div className="bg-stone-50 dark:bg-stone-900/40 p-4 rounded-2xl border border-gold-200/10 space-y-3">
                          <h5 className="font-serif font-bold text-luxury-black dark:text-gold-200 uppercase tracking-widest text-[10px]">
                            Shipment Control
                          </h5>
                          
                          <div className="flex flex-wrap items-center gap-3">
                            <span className="text-gray-400">Status:</span>
                            <select
                              value={selectedOrder.orderStatus}
                              onChange={(e) => handleUpdateStatus(selectedOrder.id, e.target.value)}
                              className="bg-white dark:bg-stone-950 border border-gold-200/40 rounded-lg p-1.5 focus:outline-none focus:border-gold-500 font-medium text-luxury-black dark:text-white"
                            >
                              <option value="Order Placed">Order Placed</option>
                              <option value="Confirmed">Confirmed</option>
                              <option value="Packed">Packed</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                            </select>

                            <span className="text-gray-400 ml-2">Payment:</span>
                            <span className="font-bold text-gold-600 dark:text-gold-400 uppercase">
                              {selectedOrder.paymentStatus}
                            </span>
                          </div>

                          {/* UPI payment verification options */}
                          {selectedOrder.paymentMethod === "Scan & Pay using UPI QR Code" &&
                            selectedOrder.paymentStatus === "Pending Verification" && (
                              <div className="border-t border-stone-200/40 pt-3 mt-2 space-y-3 animate-slide-up">
                                <p className="text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1.5">
                                  <AlertTriangle size={14} /> Action Required: Verify UPI Transfer Details
                                </p>
                                <p className="text-[11px] text-gray-500 font-light">
                                  Verify UTR: <span className="font-bold text-luxury-black dark:text-white select-all text-sm">{selectedOrder.utr}</span> against bank ledger.
                                </p>
                                
                                {selectedOrder.screenshot && (
                                  <div className="space-y-1.5">
                                    <span className="text-gray-400 block font-light">Uploaded Receipt Screenshot:</span>
                                    <div className="border border-stone-200/40 rounded-xl overflow-hidden bg-white max-w-[200px]">
                                      <img
                                        src={selectedOrder.screenshot}
                                        alt="Transaction Screenshot"
                                        className="w-full object-contain cursor-pointer max-h-36 hover:scale-105 transition-transform"
                                        onClick={() => window.open(selectedOrder.screenshot, "_blank")}
                                      />
                                    </div>
                                  </div>
                                )}

                                <button
                                  type="button"
                                  onClick={() => handleApproveUPI(selectedOrder.id)}
                                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl font-bold text-[11px] uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer"
                                >
                                  <CheckCircle size={14} /> Approve UPI Transfer & Confirm Order
                                </button>
                              </div>
                            )}
                        </div>

                        {/* Items listed */}
                        <div className="space-y-3">
                          <h5 className="font-serif font-bold text-luxury-black dark:text-gold-200 uppercase tracking-widest text-[10px]">
                            Items Grid
                          </h5>
                          <div className="divide-y divide-stone-100 dark:divide-stone-900">
                            {selectedOrder.items?.map((item) => (
                              <div key={item.id} className="flex justify-between items-center py-2.5">
                                <span className="font-semibold text-luxury-black dark:text-stone-300">
                                  {item.name} (x{item.quantity})
                                </span>
                                <span className="font-serif font-bold text-luxury-black dark:text-gold-300">
                                  {formatPrice(item.price * item.quantity)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-white dark:bg-luxury-charcoal border border-dashed border-gold-300/30 rounded-3xl p-16 text-center space-y-3 h-full flex flex-col items-center justify-center">
                        <Eye className="text-gray-300" size={36} />
                        <h4 className="font-serif font-bold text-gray-400 text-lg">No Order Selected</h4>
                        <p className="text-xs text-gray-400 font-light max-w-xs">
                          Select an order from the list on the left to verify transaction logs, modify shipment stages, and approve UPI payments.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: INVENTORY CATALOG MANAGER */}
            {activeTab === "inventory" && (
              <div className="space-y-6 animate-fade-in">
                {/* Catalog Table */}
                <div className="bg-white dark:bg-luxury-charcoal border border-gold-200/50 dark:border-stone-850/40 rounded-3xl overflow-hidden shadow-md">
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs font-light text-left text-gray-500 dark:text-stone-300">
                      <thead className="bg-stone-50 dark:bg-stone-900/60 font-serif font-bold text-sm text-luxury-black dark:text-gold-200 border-b border-gold-100/10">
                        <tr>
                          <th className="px-6 py-4">Thumbnail</th>
                          <th className="px-6 py-4">Product Name</th>
                          <th className="px-6 py-4">Category</th>
                          <th className="px-6 py-4">Price</th>
                          <th className="px-6 py-4">Stock</th>
                          <th className="px-6 py-4 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100 dark:divide-stone-900">
                        {products.map((p) => (
                          <tr key={p.id} className="hover:bg-stone-50/50 dark:hover:bg-stone-900/20">
                            <td className="px-6 py-4 shrink-0">
                              <div className="w-10 h-10 rounded overflow-hidden bg-stone-50 dark:bg-stone-950 border border-gold-100/20">
                                <img
                                  src={p.images?.[0] || "/images/products/necklace-1.svg"}
                                  alt={p.name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.target.style.display = "none";
                                  }}
                                />
                              </div>
                            </td>
                            <td className="px-6 py-4 font-semibold text-luxury-black dark:text-white max-w-xs truncate">
                              {p.name}
                            </td>
                            <td className="px-6 py-4">{p.category}</td>
                            <td className="px-6 py-4 font-bold text-luxury-black dark:text-gold-300">
                              {formatPrice(p.price)}
                            </td>
                            <td className="px-6 py-4 font-semibold">
                              <span
                                className={
                                  p.stock <= 5 ? "text-amber-500 font-bold" : "text-luxury-black dark:text-white"
                                }
                              >
                                {p.stock} units
                              </span>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <div className="flex items-center justify-center gap-3">
                                <button
                                  onClick={() => handleOpenEditModal(p)}
                                  className="p-1 text-gold-600 dark:text-gold-400 hover:text-gold-500 rounded"
                                  title="Edit Product"
                                >
                                  <Edit3 size={15} />
                                </button>
                                <button
                                  onClick={() => handleDeleteProduct(p.id)}
                                  className="p-1 text-red-500 hover:text-red-600 rounded"
                                  title="Delete Product"
                                >
                                  <Trash2 size={15} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: CATEGORY EDITOR */}
            {activeTab === "categories" && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 animate-fade-in">
                {/* Left panel: Add category form */}
                <div className="md:col-span-5 bg-white dark:bg-luxury-charcoal border border-gold-200/50 dark:border-stone-850/40 rounded-3xl p-6 shadow-sm">
                  <h3 className="font-serif text-lg font-bold text-luxury-black dark:text-white border-b border-stone-100 dark:border-stone-850 pb-2 mb-4">
                    Create New Category
                  </h3>
                  
                  <form onSubmit={handleAddCategory} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-gray-500 uppercase">Category Name</label>
                      <input
                        type="text"
                        required
                        value={newCatName}
                        onChange={(e) => setNewCatName(e.target.value)}
                        placeholder="E.g., Platinum Rings"
                        className="w-full bg-stone-50 dark:bg-stone-900 border border-gold-200/50 dark:border-stone-800 rounded-xl p-3 text-sm focus:outline-none focus:border-gold-500 text-luxury-black dark:text-white"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-gold-500 hover:bg-gold-600 text-stone-950 font-bold uppercase tracking-wider py-3.5 rounded-xl text-xs shadow-md cursor-pointer"
                    >
                      Save Category
                    </button>
                  </form>
                </div>

                {/* Right panel: list and delete categories */}
                <div className="md:col-span-7 bg-white dark:bg-luxury-charcoal border border-gold-200/50 dark:border-stone-850/40 rounded-3xl overflow-hidden shadow-sm">
                  <div className="bg-stone-50 dark:bg-stone-900/40 p-4 border-b border-gold-100/10 font-serif font-bold text-sm text-luxury-black dark:text-gold-200">
                    Active Catalog Categories ({categories.length})
                  </div>
                  
                  <div className="divide-y divide-stone-100 dark:divide-stone-900">
                    {categories.map((cat) => (
                      <div key={cat} className="p-4 flex items-center justify-between text-xs text-luxury-black dark:text-stone-300 font-semibold">
                        <span>{cat}</span>
                        {/* Guard default categories */}
                        {cat !== "All" && (
                          <button
                            onClick={() => handleDeleteCategory(cat)}
                            className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                            title="Delete Category"
                          >
                            <Trash2 size={15} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Product Add / Edit Modal Drawer */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 animate-fade-in flex items-center justify-center p-6">
          <div className="bg-white dark:bg-luxury-black border border-gold-200/50 rounded-3xl max-w-2xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            
            {/* Header */}
            <div className="flex justify-between items-center border-b border-stone-100 dark:border-stone-850 pb-3 mb-6">
              <h3 className="font-serif text-2xl font-bold text-luxury-black dark:text-white">
                {modalMode === "add" ? "Add Jewel Design" : "Edit Design Parameters"}
              </h3>
              <button
                onClick={() => setShowProductModal(false)}
                className="text-gray-400 hover:text-luxury-black dark:hover:text-white p-1"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveProduct} className="space-y-4 text-left text-xs font-light">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-gray-500 uppercase">Product Title *</label>
                  <input
                    type="text"
                    required
                    value={pName}
                    onChange={(e) => setPName(e.target.value)}
                    placeholder="E.g., Ruby Gold Drop Set"
                    className="w-full bg-stone-50 dark:bg-stone-900 border border-gold-200/50 dark:border-stone-800 rounded-xl p-3 text-sm focus:outline-none focus:border-gold-500 text-luxury-black dark:text-white font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-gray-500 uppercase">Product Category</label>
                  <select
                    value={pCat}
                    onChange={(e) => setPCat(e.target.value)}
                    className="w-full bg-stone-50 dark:bg-stone-900 border border-gold-200/50 dark:border-stone-800 rounded-xl p-3 text-sm focus:outline-none focus:border-gold-500 text-luxury-black dark:text-white font-medium"
                  >
                    {categories.filter(c => c !== "All").map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-gray-500 uppercase">Pricing (INR) *</label>
                  <input
                    type="number"
                    required
                    value={pPrice}
                    onChange={(e) => setPPrice(e.target.value)}
                    placeholder="120000"
                    className="w-full bg-stone-50 dark:bg-stone-900 border border-gold-200/50 dark:border-stone-800 rounded-xl p-3 text-sm focus:outline-none focus:border-gold-500 text-luxury-black dark:text-white font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-gray-500 uppercase">Stock quantity *</label>
                  <input
                    type="number"
                    required
                    value={pStock}
                    onChange={(e) => setPStock(e.target.value)}
                    placeholder="10"
                    className="w-full bg-stone-50 dark:bg-stone-900 border border-gold-200/50 dark:border-stone-800 rounded-xl p-3 text-sm focus:outline-none focus:border-gold-500 text-luxury-black dark:text-white font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-gray-500 uppercase">Metal Material</label>
                  <input
                    type="text"
                    value={pMat}
                    onChange={(e) => setPMat(e.target.value)}
                    placeholder="22K Gold / Platinum"
                    className="w-full bg-stone-50 dark:bg-stone-900 border border-gold-200/50 dark:border-stone-800 rounded-xl p-3 text-sm focus:outline-none focus:border-gold-500 text-luxury-black dark:text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-gray-500 uppercase">Total Weight</label>
                  <input
                    type="text"
                    value={pWeight}
                    onChange={(e) => setPWeight(e.target.value)}
                    placeholder="14.5g"
                    className="w-full bg-stone-50 dark:bg-stone-900 border border-gold-200/50 dark:border-stone-800 rounded-xl p-3 text-sm focus:outline-none focus:border-gold-500 text-luxury-black dark:text-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-gray-500 uppercase">Description Text</label>
                <textarea
                  value={pDesc}
                  onChange={(e) => setPDesc(e.target.value)}
                  placeholder="Detailed description of kundan meenakari cuts, setting parameters, styling recommendations..."
                  className="w-full bg-stone-50 dark:bg-stone-900 border border-gold-200/50 dark:border-stone-800 rounded-xl p-3 text-sm focus:outline-none focus:border-gold-500 text-luxury-black dark:text-white min-h-[80px]"
                />
              </div>

              {/* Upload Images */}
              <div className="space-y-2 border-t border-stone-100 dark:border-stone-850 pt-4">
                <label className="text-[10px] font-semibold text-gray-500 uppercase block">Product Images</label>
                <div className="flex flex-wrap gap-3 mb-2">
                  {pImages.map((img, idx) => (
                    <div key={idx} className="relative w-16 h-16 rounded overflow-hidden bg-stone-100 border border-gold-200/20">
                      <img src={img} alt="Uploaded product preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setPImages((prev) => prev.filter((_, i) => i !== idx))}
                        className="absolute top-0 right-0 bg-red-600 text-white rounded-bl p-0.5"
                      >
                        <X size={10} />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="relative">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="bg-stone-50 dark:bg-stone-900 border border-dashed border-gold-300/40 rounded-xl p-3 text-sm text-center text-gray-400 font-semibold hover:border-gold-500 min-h-[46px] flex items-center justify-center">
                    {uploadingImage ? "Uploading..." : "Click to select multiple design images"}
                  </div>
                </div>
              </div>

              {/* Modal footer CTAs */}
              <div className="pt-6 border-t border-stone-100 dark:border-stone-850 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="w-1/2 border border-gray-200 text-gray-500 py-3.5 rounded-xl font-bold uppercase tracking-wider text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 bg-gold-500 hover:bg-gold-600 text-stone-950 py-3.5 rounded-xl font-bold uppercase tracking-wider text-xs shadow-md"
                >
                  Save Masterpiece
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
