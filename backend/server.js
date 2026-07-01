import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Import Routes
import productRoutes from "./routes/productRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: "50mb" })); // support large image uploads/screenshots

// API Routes mounting
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reviews", reviewRoutes);

// Root test endpoint
app.get("/", (req, res) => {
  res.json({ message: "Srushti Jewellery API Server is running!" });
});

// Start listening
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
