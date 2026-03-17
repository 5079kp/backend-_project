const express = require("express");
const { param, validationResult, body } = require("express-validator");
const mongoose = require("mongoose");
const router = express.Router();

const Cart = require("../models/Cart");
const Book = require("../models/Book");

// Helper
const checkObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const getCartQuery = (req) => {
  if (req.session && req.session.userId) {
    return { userId: req.session.userId };
  }
  return { sessionId: req.sessionID };
};

// Add/increment cart
router.get("/add/:id",
  param("id").custom(checkObjectId),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("error", { message: errors.array()[0].msg });
    }
    try {
      const query = { ...getCartQuery(req), bookId: req.params.id };
      let cartItem = await Cart.findOne(query);
      if (cartItem) {
        // Increment quantity
        cartItem.quantity += 1;
        await cartItem.save();
      } else {
        const book = await Book.findById(req.params.id);
        if (!book) return res.status(404).render("error", { message: "Book not found" });
        cartItem = new Cart({
          ...getCartQuery(req),
          bookId: book._id,
          title: book.title,
          price: book.price,
          image: book.image,
          quantity: 1
        });
        await cartItem.save();
      }
      res.redirect("/cart");
    } catch (err) {
      console.error(err);
      res.status(500).render("error", { message: "Add to cart failed" });
    }
  }
);

// Buy now
router.get("/buy/:id",
  param("id").custom(checkObjectId),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("error", { message: errors.array()[0].msg });
    }
    try {
      const query = { ...getCartQuery(req), bookId: req.params.id };
      let cartItem = await Cart.findOne(query);
      if (!cartItem) {
        const book = await Book.findById(req.params.id);
        if (!book) return res.status(404).render("error", { message: "Book not found" });
        cartItem = new Cart({
          ...getCartQuery(req),
          bookId: book._id,
          title: book.title,
          price: book.price,
          image: book.image,
          quantity: 1
        });
        await cartItem.save();
      }
      res.redirect("/cart/payment");
    } catch (err) {
      res.status(500).render("error", { message: "Buy now failed" });
    }
  }
);

// Cart list with populate/total - FIX: populate actually used, but ensure works
router.get("/", async (req, res) => {
  try {
    const items = await Cart.find(getCartQuery(req)).populate('bookId');
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    res.render("cart", { items, total });
  } catch (err) {
    console.error(err);
    res.status(500).render("error", { message: "Cart load failed" });
  }
});


// Delete cart item
router.get("/delete/:id",
  param("id").custom(checkObjectId),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("error", { message: errors.array()[0].msg });
    }
    try {
      await Cart.findOneAndDelete({ ...getCartQuery(req), _id: req.params.id });
      res.redirect("/cart");
    } catch (err) {
      res.status(500).render("error", { message: "Remove failed" });
    }
  }
);

// Delete cart POST (secure AJAX)
router.post("/delete/:id",
  param("id").custom(checkObjectId),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }
    try {
      await Cart.findOneAndDelete({ ...getCartQuery(req), _id: req.params.id });
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: "Remove failed" });
    }
  }
);

// Update cart quantity POST (AJAX)
router.post("/update/:id",
  param("id").custom(checkObjectId),
  body("quantity").isInt({ min: 1 }).withMessage("Quantity must be at least 1"),
  express.urlencoded({ extended: true }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }
    try {
      const cartItem = await Cart.findOne({ ...getCartQuery(req), _id: req.params.id });
      if (!cartItem) return res.status(404).json({ error: "Cart item not found" });
      
      const newQty = parseInt(req.body.quantity);
      if (newQty < 1) {
        await Cart.findOneAndDelete({ ...getCartQuery(req), _id: req.params.id });
        return res.json({ success: true, deleted: true });
      }
      
      cartItem.quantity = newQty;
      await cartItem.save();
      res.json({ 
        success: true, 
        quantity: cartItem.quantity,
        total: (cartItem.price * cartItem.quantity).toFixed(2)
      });
    } catch (err) {
      res.status(500).json({ error: "Update failed" });
    }
  }
);

// Cart count API
router.get("/api/count", async (req, res) => {
  try {
    const count = await Cart.countDocuments(getCartQuery(req));
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: "Count failed" });
  }
});

// Payment (placeholder - add real integration later)
router.get("/payment", async (req, res) => {
  try {
    const items = await Cart.find(getCartQuery(req)).populate('bookId');
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    res.render("payment", { items, total });
  } catch (err) {
    res.status(500).render("error", { message: "Payment page error" });
  }
});

module.exports = router;
