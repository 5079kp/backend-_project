import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from "cors";
import cookieParser from "cookie-parser";

// Import configurations and routes
import connectDB from "./config/db.js";
import { errorHandler } from "./middleware/errorMiddleware.js";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Connect to MongoDB
connectDB();

// ============ MIDDLEWARE (Order matters!) ============

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser
app.use(cookieParser());

// Enable CORS (for frontend at localhost:5173)
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Static folder for uploads
app.use("/uploads", express.static("uploads"));

// ============ ROUTES ============

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);
app.use("/api/cart", cartRoutes);

// Root route (only one!)
app.get("/", (req, res) => {
  res.json({ 
    message: "API is running...",
    mongodb: mongoose.connection.readyState === 1 ? "Connected" : "Disconnected",
    endpoints: {
      auth: "/api/auth",
      products: "/api/products",
      orders: "/api/orders",
      users: "/api/users",
      cart: "/api/cart"
    }
  });
});

// ============ ERROR HANDLING ============
// Error handling middleware (should be last)
app.use(errorHandler);

// ============ START SERVER ============
app.listen(PORT, () => {
  console.log(` Server running in development mode on port ${PORT}`);
  console.log(` Access at: http://localhost:${PORT}`);
  console.log(` Frontend URL: http://localhost:5173`);
  console.log(` Uploads folder: /uploads`);
});