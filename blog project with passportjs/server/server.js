import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import session from "express-session";
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "passport";
import initPassport from "./config/passport.js";

import Admin from "./models/Admin.js";
import adminRoutes from "./routes/adminRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";

dotenv.config();

//  Connect DB
await connectDB();

const createDefaultAdmin = async () => {
  const count = await Admin.countDocuments({ role: "admin" });
  if (count === 0) {
    await Admin.create({ username: "admin", password: "admin123", role: "admin" });
    console.log("Default admin created: admin / admin123");
  }
};

await createDefaultAdmin();

const app = express();

//  Middleware
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    callback(new Error("CORS policy: origin not allowed"));
  },
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

app.use(session({
  secret: "secret123",
  resave: false,
  saveUninitialized: false,
  cookie: {
    sameSite: "lax",
    secure: false,
  },
}));

initPassport();
app.use(passport.initialize());
app.use(passport.session());

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
  res.status(500).json({ message: "Server Error" });
});


//  PORT FIX (important)
const PORT = parseInt(process.env.PORT, 10) || 8000;

// Start Server
const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(`Port ${PORT} is already in use. Close the existing process or update PORT in .env.`);
  } else {
    console.error(error);
  }
});