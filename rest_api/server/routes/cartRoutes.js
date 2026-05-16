import express from "express";
import {
  getCart,
  addToCart,
  updateCartItemQty,
  removeFromCart,
  clearCart,
  getCartItemCount, 
} from "../controllers/cartController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Fixed: All cart routes require authentication
router.use(protect); // Cleaner approach - protect all routes at once

router.route("/")
  .get(getCart)
  .post(addToCart)
  .delete(clearCart);

router.get("/count", getCartItemCount);
router.put("/:productId", updateCartItemQty);
router.delete("/:productId", removeFromCart);

export default router;