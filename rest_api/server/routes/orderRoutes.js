import express from "express";
import {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  getOrders,
  cancelOrder,       
  getOrderSummary,   
} from "../controllers/orderController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes (none currently)

// Order routes
router.route("/")
  .post(protect, addOrderItems)
  .get(protect, admin, getOrders);

// User's own orders
router.route("/myorders")
  .get(protect, getMyOrders);

// Order statistics (admin only)
router.route("/stats/summary")
  .get(protect, admin, getOrderSummary);

// Individual order routes - order matters! Place specific routes before generic :id routes
router.route("/:id")
  .get(protect, getOrderById);

router.route("/:id/pay")
  .put(protect, updateOrderToPaid);

router.route("/:id/deliver")
  .put(protect, admin, updateOrderToDelivered);

router.route("/:id/cancel")
  .put(protect, cancelOrder);

export default router;