const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const mongoose = require("mongoose");
const path = require("path");
const helmet = require("helmet");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Security
app.use(helmet());
app.use(cors());

// Body parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'bookstore-dev-secret',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI || "mongodb://localhost:27017/bookstore", collectionName: 'sessions' }),
  cookie: { 
    secure: process.env.NODE_ENV === 'production',
    maxAge: 1000 * 60 * 60 * 24 // 24 hours
  }
}));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/bookstore")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error("MongoDB connection error:", err));

// Make session user available in views
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

// Routes
const bookRoutes = require("./routes/bookRoutes");
const cartRoutes = require("./routes/cartRoutes");
const authRoutes = require("./routes/authRoutes");

app.use("/", bookRoutes);
app.use("/cart", cartRoutes);
app.use(authRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).render("error", { message: "Page not found" });
});

// Error handler - multer errors handled by middleware/multer.js
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render("error", { message: err.message || "Something went wrong!" });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Admin login: http://localhost:${PORT}/login`);
});

