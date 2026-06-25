import { INITIAL_PRODUCTS, INITIAL_REVIEWS, CATEGORIES } from "../data/mockProducts";

// Helper to check if Firebase is configured (could be used if Firebase sdk is installed)
const isFirebaseConfigured = () => {
  return !!(
    import.meta.env &&
    import.meta.env.VITE_FIREBASE_API_KEY &&
    import.meta.env.VITE_FIREBASE_PROJECT_ID
  );
};

// Initialize localStorage with initial data if empty
const initLocalDb = () => {
  const existingProducts = localStorage.getItem("srushti_products");
  if (!existingProducts) {
    localStorage.setItem("srushti_products", JSON.stringify(INITIAL_PRODUCTS));
  } else {
    try {
      const parsed = JSON.parse(existingProducts);
      const hasSvg = parsed.some(p => 
        p.images && p.images.some(img => typeof img === "string" && (img.includes("/images/products/") || img.endsWith(".svg")))
      );
      if (hasSvg) {
        // Upgrade existing products with the new high-quality Unsplash image URLs
        const upgraded = parsed.map(p => {
          const match = INITIAL_PRODUCTS.find(ip => ip.id === p.id);
          if (match) {
            return { ...p, images: match.images };
          }
          return p;
        });
        localStorage.setItem("srushti_products", JSON.stringify(upgraded));
      }
    } catch (e) {
      localStorage.setItem("srushti_products", JSON.stringify(INITIAL_PRODUCTS));
    }
  }
  if (!localStorage.getItem("srushti_reviews")) {
    localStorage.setItem("srushti_reviews", JSON.stringify(INITIAL_REVIEWS));
  }
  if (!localStorage.getItem("srushti_categories")) {
    localStorage.setItem("srushti_categories", JSON.stringify(CATEGORIES));
  }
  const existingOrders = localStorage.getItem("srushti_orders");
  const initialOrders = [
    {
      id: "ORD-9832",
      customerName: "Aarav Mehta",
      mobile: "9876543210",
      address: "Flat 402, Golden Heights, MG Road",
      city: "Mumbai",
      pincode: "400001",
      paymentMethod: "Scan & Pay using UPI QR Code",
      paymentStatus: "Pending Verification",
      orderStatus: "Order Placed",
      items: [
        {
          id: "p1",
          name: "Royal Peacock Gold Choker Set",
          price: 185000,
          quantity: 1,
          images: ["https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop&q=80"]
        }
      ],
      subtotal: 185000,
      tax: 5550, // 3% GST
      delivery: 0,
      total: 190550,
      utr: "123456789012",
      screenshot: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100'><rect width='100' height='100' fill='%23c5a880'/><text x='10' y='50' fill='white'>MOCK RECEIPT</text></svg>",
      date: "2026-06-23T10:15:30.000Z"
    },
    {
      id: "ORD-1284",
      customerName: "Priyanka Sen",
      mobile: "9123456789",
      address: "Sector 5, Salt Lake City",
      city: "Kolkata",
      pincode: "700091",
      paymentMethod: "Cash On Delivery",
      paymentStatus: "Pending COD Delivery",
      orderStatus: "Shipped",
      items: [
        {
          id: "p3",
          name: "Classic Jhumka Drop Earrings",
          price: 85000,
          quantity: 1,
          images: ["https://images.unsplash.com/photo-1630019852942-f89202989a59?w=800&auto=format&fit=crop&q=80"]
        }
      ],
      subtotal: 85000,
      tax: 2550,
      delivery: 0,
      total: 87550,
      date: "2026-06-22T14:22:00.000Z"
    }
  ];

  if (!existingOrders) {
    localStorage.setItem("srushti_orders", JSON.stringify(initialOrders));
  } else {
    try {
      const parsed = JSON.parse(existingOrders);
      let updated = false;
      const upgraded = parsed.map(order => {
        let orderUpdated = false;
        const updatedItems = order.items.map(item => {
          if (item.images && item.images.some(img => typeof img === "string" && (img.includes("/images/products/") || img.endsWith(".svg")))) {
            const productMatch = INITIAL_PRODUCTS.find(ip => ip.id === item.id);
            if (productMatch) {
              orderUpdated = true;
              return { ...item, images: [productMatch.images[0]] };
            }
          }
          return item;
        });
        if (orderUpdated) {
          updated = true;
          return { ...order, items: updatedItems };
        }
        return order;
      });
      if (updated) {
        localStorage.setItem("srushti_orders", JSON.stringify(upgraded));
      }
    } catch (e) {
      localStorage.setItem("srushti_orders", JSON.stringify(initialOrders));
    }
  }
};

// Seed db immediately on import
initLocalDb();

// Product CRUD functions
export const getProducts = async () => {
  if (isFirebaseConfigured()) {
    // If Firebase is configured, implement Firestore fetching:
    // const snapshot = await getDocs(collection(db, "products"));
    // return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
  return JSON.parse(localStorage.getItem("srushti_products") || "[]");
};

export const addProduct = async (product) => {
  const products = await getProducts();
  const newProduct = {
    ...product,
    id: product.id || "p_" + Date.now(),
    rating: parseFloat(product.rating) || 5.0,
    reviewsCount: parseInt(product.reviewsCount) || 0
  };
  products.push(newProduct);
  localStorage.setItem("srushti_products", JSON.stringify(products));
  return newProduct;
};

export const updateProduct = async (updatedProduct) => {
  const products = await getProducts();
  const index = products.findIndex((p) => p.id === updatedProduct.id);
  if (index !== -1) {
    products[index] = { ...products[index], ...updatedProduct };
    localStorage.setItem("srushti_products", JSON.stringify(products));
    return products[index];
  }
  throw new Error("Product not found");
};

export const deleteProduct = async (id) => {
  const products = await getProducts();
  const filtered = products.filter((p) => p.id !== id);
  localStorage.setItem("srushti_products", JSON.stringify(filtered));
  return true;
};

// Categories CRUD functions
export const getCategories = async () => {
  return JSON.parse(localStorage.getItem("srushti_categories") || "[]");
};

export const addCategory = async (category) => {
  const categories = await getCategories();
  if (!categories.includes(category)) {
    categories.push(category);
    localStorage.setItem("srushti_categories", JSON.stringify(categories));
  }
  return categories;
};

export const deleteCategory = async (category) => {
  const categories = await getCategories();
  const filtered = categories.filter((c) => c !== category);
  localStorage.setItem("srushti_categories", JSON.stringify(filtered));
  return filtered;
};

// Order CRUD functions
export const getOrders = async () => {
  return JSON.parse(localStorage.getItem("srushti_orders") || "[]");
};

export const createOrder = async (orderData) => {
  const orders = await getOrders();
  const newOrder = {
    ...orderData,
    id: "ORD-" + Math.floor(1000 + Math.random() * 9000),
    date: new Date().toISOString(),
    orderStatus: "Order Placed"
  };
  
  // Decrease stock for ordered items
  const products = await getProducts();
  newOrder.items.forEach(item => {
    const productIndex = products.findIndex(p => p.id === item.id);
    if (productIndex !== -1) {
      const currentStock = products[productIndex].stock || 0;
      products[productIndex].stock = Math.max(0, currentStock - item.quantity);
      if (products[productIndex].stock === 0) {
        products[productIndex].availability = "Out of Stock";
      }
    }
  });
  localStorage.setItem("srushti_products", JSON.stringify(products));

  orders.unshift(newOrder); // Add to beginning
  localStorage.setItem("srushti_orders", JSON.stringify(orders));
  return newOrder;
};

export const updateOrderStatus = async (orderId, status) => {
  const orders = await getOrders();
  const index = orders.findIndex((o) => o.id === orderId);
  if (index !== -1) {
    orders[index].orderStatus = status;
    // Auto-update payment status for COD if delivered
    if (status === "Delivered" && orders[index].paymentMethod === "Cash On Delivery") {
      orders[index].paymentStatus = "Paid";
    }
    localStorage.setItem("srushti_orders", JSON.stringify(orders));
    return orders[index];
  }
  throw new Error("Order not found");
};

export const approveUpiPayment = async (orderId) => {
  const orders = await getOrders();
  const index = orders.findIndex((o) => o.id === orderId);
  if (index !== -1) {
    orders[index].paymentStatus = "Paid";
    orders[index].orderStatus = "Confirmed";
    localStorage.setItem("srushti_orders", JSON.stringify(orders));
    return orders[index];
  }
  throw new Error("Order not found");
};

// Reviews CRUD functions
export const getReviews = async () => {
  return JSON.parse(localStorage.getItem("srushti_reviews") || "[]");
};

export const addReview = async (review) => {
  const reviews = await getReviews();
  const newReview = {
    ...review,
    id: "r_" + Date.now(),
    date: new Date().toISOString().split("T")[0]
  };
  reviews.unshift(newReview);
  localStorage.setItem("srushti_reviews", JSON.stringify(reviews));

  // Update product average rating & reviewsCount
  const products = await getProducts();
  const productIndex = products.findIndex((p) => p.name === review.productName || p.id === review.productId);
  if (productIndex !== -1) {
    const currentProduct = products[productIndex];
    const oldReviewsCount = currentProduct.reviewsCount || 0;
    const oldRating = currentProduct.rating || 5.0;
    const newCount = oldReviewsCount + 1;
    const newRating = parseFloat(((oldRating * oldReviewsCount + review.rating) / newCount).toFixed(1));
    
    products[productIndex].reviewsCount = newCount;
    products[productIndex].rating = newRating;
    localStorage.setItem("srushti_products", JSON.stringify(products));
  }

  return newReview;
};
