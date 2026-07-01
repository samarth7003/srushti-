import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { WhatsAppFloat } from "./components/WhatsAppFloat";
import { MobileBottomNav } from "./components/MobileBottomNav";
import { ToastContainer } from "./components/Toast";

// Pages
import { Home } from "./pages/Home";
import { Collections } from "./pages/Collections";
import { ProductDetails } from "./pages/ProductDetails";
import { Cart } from "./pages/Cart";
import { Checkout } from "./pages/Checkout";
import { TrackOrder } from "./pages/TrackOrder";
import { AboutUs } from "./pages/AboutUs";
import { Contact } from "./pages/Contact";
import { Reviews } from "./pages/Reviews";
import { AdminDashboard } from "./pages/AdminDashboard";
import { Account } from "./pages/Account";

import { useAuth } from "./context/AuthContext";

function AppContent() {
  const [toasts, setToasts] = useState([]);
  const { user, authLoading } = useAuth();

  const addToast = (message, type = "success") => {
    const id = Date.now() + Math.random().toString(36).substr(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ivory-100">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gold-600"></div>
      </div>
    );
  }

  // If not logged in, force render the login / register form
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col justify-between bg-white text-ink-900 transition-colors duration-300 font-sans">
        <main className="flex-grow flex items-center justify-center py-12">
          <Account addToast={addToast} />
        </main>
        <ToastContainer toasts={toasts} removeToast={removeToast} />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-16 md:pb-0 flex flex-col justify-between bg-white text-ink-900 transition-colors duration-300 font-sans">
      <Navbar />
      
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home addToast={addToast} />} />
          <Route path="/collections" element={<Collections addToast={addToast} />} />
          <Route path="/product/:id" element={<ProductDetails addToast={addToast} />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout addToast={addToast} />} />
          <Route path="/track-order" element={<TrackOrder />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<Contact addToast={addToast} />} />
          <Route path="/reviews" element={<Reviews addToast={addToast} />} />
          <Route path="/admin" element={<AdminDashboard addToast={addToast} />} />
          <Route path="/account" element={<Account addToast={addToast} />} />
        </Routes>
      </main>


      <div className="section-divider"></div>

      <Footer addToast={addToast} />
      
      {/* Utility Floating Helpers */}
      <WhatsAppFloat />
      <MobileBottomNav />
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <CartProvider>
        <AuthProvider>
          <Router>
            <AppContent />
          </Router>
        </AuthProvider>
      </CartProvider>
    </ThemeProvider>
  );
}

export default App;
