import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";

// Import Routes
import productRoutes from "./routes/product/productRoutes.js";
import categoryRoutes from "./routes/category/categoryRoutes.js";
import orderRoutes from "./routes/order/orderRoutes.js";
import reviewRoutes from "./routes/review/reviewRoutes.js";
import usersRoutes from "./routes/users/usersRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Apply Helmet security headers
app.use(helmet());

// Configure origin-restricted CORS mapping
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(",") 
  : ["http://localhost:5173", "http://localhost:3000"];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, postman)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Blocked by CORS policy"));
    }
  },
  credentials: true
}));

app.use(express.json({ limit: "50mb" })); // support large image uploads/screenshots

// Define General API Rate Limiting (100 requests per 1 minute window)
const generalLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  limit: 100,
  message: { error: "Too many requests from this IP, please try again later." },
  standardHeaders: "draft-7",
  legacyHeaders: false,
});
app.use("/api", generalLimiter);

// Define Strict Auth Rate Limiting (15 requests per 15 minutes window for login/register)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 15,
  message: { error: "Too many login/registration attempts, please try again in 15 minutes." },
  standardHeaders: "draft-7",
  legacyHeaders: false,
});
app.use("/api/auth/login", authLimiter);
app.use("/api/auth/register", authLimiter);

// API Routes mounting
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/auth", usersRoutes);

// Root test endpoint
app.get("/", (req, res) => {
  res.json({ message: "Srushti Jewellery API Server is running!" });
});

// Start listening
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
