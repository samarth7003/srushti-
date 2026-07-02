import jwt from "jsonwebtoken";

// Middleware to verify JWT token and extract user details
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Format: "Bearer <token>"

  if (!token) {
    return res.status(401).json({ error: "Access token is missing. Please log in." });
  }

  const secret = process.env.JWT_SECRET;
  if (!secret && process.env.NODE_ENV === "production") {
    console.error("CRITICAL SECURITY ERROR: JWT_SECRET environment variable is missing in production!");
    return res.status(500).json({ error: "Internal server security error." });
  }

  jwt.verify(token, secret || "srushti_secret_jwt_key_2026", (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Your session has expired or is invalid. Please log in again." });
    }
    req.user = user; // user payload contains: id, email, role, name
    next();
  });
};

// Middleware to restrict access to Admins only
export const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ error: "Access denied. Administrator privileges required." });
  }
  next();
};
