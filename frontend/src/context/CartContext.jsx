import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("srushti_cart");
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem("srushti_wishlist");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("srushti_cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("srushti_wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  // Cart operations
  const addToCart = (product, quantity = 1, options = {}) => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex(
        (item) => item.id === product.id && JSON.stringify(item.options) === JSON.stringify(options)
      );

      if (existingItemIndex > -1) {
        const updated = [...prevCart];
        updated[existingItemIndex].quantity += quantity;
        return updated;
      } else {
        return [
          ...prevCart,
          {
            id: product.id,
            name: product.name,
            price: product.price,
            images: product.images,
            weight: product.weight,
            material: product.material,
            quantity,
            options
          }
        ];
      }
    });
  };

  const removeFromCart = (productId, options = {}) => {
    setCart((prevCart) =>
      prevCart.filter(
        (item) => !(item.id === productId && JSON.stringify(item.options) === JSON.stringify(options))
      )
    );
  };

  const updateCartQty = (productId, quantity, options = {}) => {
    if (quantity <= 0) {
      removeFromCart(productId, options);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId && JSON.stringify(item.options) === JSON.stringify(options)
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  // Wishlist operations
  const toggleWishlist = (product) => {
    setWishlist((prevWishlist) => {
      const isAlreadyIn = prevWishlist.some((item) => item.id === product.id);
      if (isAlreadyIn) {
        return prevWishlist.filter((item) => item.id !== product.id);
      } else {
        return [...prevWishlist, product];
      }
    });
  };

  const isInWishlist = (productId) => {
    return wishlist.some((item) => item.id === productId);
  };

  // Calculations
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartSubtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  // Gold jewellery usually has 3% GST in India
  const cartTax = Math.round(cartSubtotal * 0.03);
  // Free delivery for premium orders, else 150 INR shipping
  const deliveryFee = cartSubtotal > 15000 || cartSubtotal === 0 ? 0 : 150;
  const cartTotal = cartSubtotal + cartTax + deliveryFee;

  return (
    <CartContext.Provider
      value={{
        cart,
        wishlist,
        addToCart,
        removeFromCart,
        updateCartQty,
        clearCart,
        toggleWishlist,
        isInWishlist,
        cartCount,
        cartSubtotal,
        cartTax,
        deliveryFee,
        cartTotal
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};
