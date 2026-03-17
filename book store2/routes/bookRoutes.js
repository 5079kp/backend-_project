const express = require("express");
const { body, param, validationResult } = require("express-validator");
const router = express.Router();

const Book = require("../models/Book");
const upload = require("../middleware/multer");
const fs = require("fs").promises;
const path = require("path");

// Helper: check if valid ObjectId
const mongoose = require('mongoose'); // Add mongoose for ObjectId
const checkObjectId = (id) => mongoose.Types.ObjectId.isValid(id);


// Home
router.get("/", async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    res.render("index", { books });
  } catch (err) {
    console.error(err);
    res.status(500).render("error", { message: "Server error" });
  }
});

// Admin Dashboard
const { requireAdmin } = require('../middleware/auth');
router.get("/admin", requireAdmin, async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    res.render("admin-dashboard", { books });
  } catch (err) {
    console.error(err);
    res.status(500).render("error", { message: "Admin dashboard load failed" });
  }
});

// Add form
router.get("/add", requireAdmin, (req, res) => res.render("addBook"));

// Validate & save book
router.post("/add", requireAdmin,
  upload.single("image"),
  [
    body("title").trim().notEmpty().withMessage("Title required").isLength({ max: 100 }),
    body("author").trim().notEmpty().withMessage("Author required").isLength({ max: 50 }),
    body("price").isFloat({ min: 0.01 }).withMessage("Price must be positive"),
    body("description").trim().optional().isLength({ max: 500 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render("addBook", { errors: errors.array(), ...req.body });
    }
    try {
      const bookData = {
        title: req.body.title.trim(),
        author: req.body.author.trim(),
        price: parseFloat(req.body.price),
        description: req.body.description?.trim() || ""
      };
      if (req.file) bookData.image = req.file.filename;
      const book = new Book(bookData);
      await book.save();
      res.redirect("/admin");
    } catch (err) {
      res.status(400).render("addBook", { errors: [{ msg: err.message }], ...req.body });
    }
  }
);

// Edit form
router.get("/edit/:id", requireAdmin,
  param("id").custom(checkObjectId).withMessage("Invalid book ID"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("error", { message: errors.array()[0].msg });
    }
    try {
      const book = await Book.findById(req.params.id);
      if (!book) return res.status(404).render("error", { message: "Book not found" });
      res.render("editBook", { book, errors: [] });
    } catch (err) {
      res.status(500).render("error", { message: "Server error" });
    }
  }
);

// Update
router.post("/update/:id", requireAdmin,
  param("id").custom(checkObjectId),
  upload.single("image"),
  [
    body("title").trim().notEmpty().isLength({ max: 100 }),
    body("author").trim().notEmpty().isLength({ max: 50 }),
    body("price").isFloat({ min: 0.01 }),
    body("description").optional().isLength({ max: 500 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const book = await Book.findById(req.params.id);
      return res.render("editBook", { book, errors: errors.array() });
    }
    try {
      const book = await Book.findById(req.params.id);
      if (!book) return res.status(404).render("error", { message: "Book not found" });
      
      const updateData = {
        title: req.body.title.trim(),
        author: req.body.author.trim(),
        price: parseFloat(req.body.price),
        description: req.body.description?.trim() || ""
      };
      
      if (req.file) {
        // Cleanup old image
        try {
          await fs.unlink(path.join("public/uploads", book.image));
        } catch (unlinkErr) {
          console.log("Old image not found:", book.image);
        }
        updateData.image = req.file.filename;
      }
      
      await Book.findByIdAndUpdate(req.params.id, updateData);
      res.redirect("/admin");
    } catch (err) {
      res.status(400).render("error", { message: err.message });
    }
  }
);

// Delete
router.get("/delete/:id", requireAdmin,
  param("id").custom(checkObjectId),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("error", { message: errors.array()[0].msg });
    }
    try {
      const book = await Book.findById(req.params.id);
      if (!book) return res.status(404).render("error", { message: "Book not found" });
      
      // Delete image
      if (book.image && book.image !== 'default-book.jpg') {
        await fs.unlink(path.join("public/uploads", book.image)).catch(console.log);
      }
      
      await Book.findByIdAndDelete(req.params.id);
      res.redirect("/admin");
    } catch (err) {
      res.status(500).render("error", { message: "Delete failed" });
    }
  }
);

// Delete POST (secure AJAX)
router.post("/delete/:id", requireAdmin,
  param("id").custom(checkObjectId),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }
    try {
      const book = await Book.findById(req.params.id);
      if (!book) return res.status(404).json({ error: "Book not found" });
      
      if (book.image && book.image !== 'default-book.jpg') {
        await fs.unlink(path.join("public/uploads", book.image)).catch(console.log);
      }
      
      await Book.findByIdAndDelete(req.params.id);
      res.json({ success: true, redirect: "/" });
    } catch (err) {
      res.status(500).json({ error: "Delete failed" });
    }
  }
);

// Book details
router.get("/book/:id",
  param("id").custom(checkObjectId),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("error", { message: errors.array()[0].msg });
    }
    try {
      const book = await Book.findById(req.params.id);
      if (!book) return res.status(404).render("error", { message: "Book not found" });
      const relatedBooks = await Book.find({ _id: { $ne: book._id } }).limit(3);
      res.render("bookDetails", { book, relatedBooks });
    } catch (err) {
      res.status(500).render("error", { message: "Server error" });
    }
  }
);

module.exports = router;
