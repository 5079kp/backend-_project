import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import session from "express-session";
import cors from "cors";
import cookieParser from "cookie-parser";

import Admin from "./models/Admin.js";
import adminRoutes from "./routes/adminRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";

dotenv.config();

//  Connect DB
await connectDB();

const createDefaultAdmin = async () => {
  const count = await Admin.countDocuments();
  if (count === 0) {
    await Admin.create({ username: "admin", password: "admin123" });
    console.log("Default admin created: admin / admin123");
  }
};

await createDefaultAdmin();

const app = express();

//  Middleware
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use(session({
  secret: "secret123",
  resave: false,
  saveUninitialized: true
}));

//  Static folder
app.use("/uploads", express.static("uploads"));


//  ROOT ROUTE (VERY IMPORTANT)
app.get("/", (req, res) => {
  res.send("Server is running successfully");
});


//  API Routes
app.use("/api/admin", adminRoutes);
app.use("/api/blogs", blogRoutes);


//  404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found " });
});


//  Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Server Error " });
});


//  PORT FIX (important)
const PORT = process.env.PORT || 5000;


// Start Server
app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});