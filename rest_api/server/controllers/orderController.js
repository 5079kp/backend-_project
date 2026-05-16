import Order from "../models/Order.js";
import Product from "../models/Product.js"; 
import Cart from "../models/Cart.js"; 

const addOrderItems = async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    } = req.body;

    // Validate required fields
    if (!orderItems || orderItems.length === 0) {
      res.status(400);
      throw new Error("No order items");
    }

    if (!shippingAddress) {
      res.status(400);
      throw new Error("Shipping address is required");
    }

    if (!paymentMethod) {
      res.status(400);
      throw new Error("Payment method is required");
    }

    // Fixed: Validate and update product stock
    for (const item of orderItems) {
      const product = await Product.findById(item._id);
      
      if (!product) {
        res.status(404);
        throw new Error(`Product ${item.name} not found`);
      }
      
      if (product.countInStock < item.qty) {
        res.status(400);
        throw new Error(`Insufficient stock for ${product.name}. Only ${product.countInStock} left`);
      }
    }

    const order = new Order({
      orderItems: orderItems.map((item) => ({
        name: item.name,
        qty: item.qty,
        image: item.image,
        price: item.price,
        product: item._id, 
      })),
      user: req.user._id,
      shippingAddress: {
        address: shippingAddress.address,
        city: shippingAddress.city,
        postalCode: shippingAddress.postalCode,
        country: shippingAddress.country,
      },
      paymentMethod,
      itemsPrice: Number(itemsPrice).toFixed(2),
      taxPrice: Number(taxPrice).toFixed(2),
      shippingPrice: Number(shippingPrice).toFixed(2),
      totalPrice: Number(totalPrice).toFixed(2),
    });

    const createdOrder = await order.save();

    // Fixed: Update product stock after order creation
    for (const item of orderItems) {
      const product = await Product.findById(item._id);
      product.countInStock -= item.qty;
      await product.save();
    }

    // Fixed: Clear user's cart after successful order
    await Cart.findOneAndDelete({ user: req.user._id });

    res.status(201).json({
      success: true,
      order: createdOrder,
      message: "Order created successfully"
    });
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode).json({
      success: false,
      message: error.message
    });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email")
      .populate("orderItems.product", "name price image"); // Added product details

    if (!order) {
      res.status(404);
      throw new Error("Order not found");
    }

    // Fixed: Check if user is authorized to view this order
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      res.status(403);
      throw new Error("Not authorized to view this order");
    }

    res.json({
      success: true,
      order
    });
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode).json({
      success: false,
      message: error.message
    });
  }
};


const updateOrderToPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      res.status(404);
      throw new Error("Order not found");
    }

    // Fixed: Check if order is already paid
    if (order.isPaid) {
      res.status(400);
      throw new Error("Order is already paid");
    }

    // Fixed: Validate payment result data
    const { id, status, update_time, email_address, payer } = req.body;

    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: id || "Unknown",
      status: status || "Completed",
      update_time: update_time || new Date().toISOString(),
      email_address: email_address || req.user.email,
      payer: payer || {},
    };

    const updatedOrder = await order.save();

    res.json({
      success: true,
      order: updatedOrder,
      message: "Order marked as paid"
    });
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode).json({
      success: false,
      message: error.message
    });
  }
};

const updateOrderToDelivered = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      res.status(404);
      throw new Error("Order not found");
    }

    // Fixed: Check if order is paid before delivering
    if (!order.isPaid) {
      res.status(400);
      throw new Error("Order must be paid before delivery");
    }

    // Fixed: Check if order is already delivered
    if (order.isDelivered) {
      res.status(400);
      throw new Error("Order is already delivered");
    }

    order.isDelivered = true;
    order.deliveredAt = Date.now();
    order.status = "Delivered";

    const updatedOrder = await order.save();

    res.json({
      success: true,
      order: updatedOrder,
      message: "Order marked as delivered"
    });
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode).json({
      success: false,
      message: error.message
    });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 }); // Fixed: Sort by newest first

    res.json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getOrders = async (req, res) => {
  try {
    // Fixed: Add pagination support
    const pageSize = Number(req.query.pageSize) || 10;
    const page = Number(req.query.page) || 1;
    
    const keyword = req.query.keyword
      ? {
          $or: [
            { "orderItems.name": { $regex: req.query.keyword, $options: "i" } },
            { "shippingAddress.city": { $regex: req.query.keyword, $options: "i" } }
          ]
        }
      : {};

    const count = await Order.countDocuments({ ...keyword });
    
    const orders = await Order.find({ ...keyword })
      .populate("user", "id name email")
      .sort({ createdAt: -1 })
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({
      success: true,
      orders,
      page,
      pages: Math.ceil(count / pageSize),
      total: count
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      res.status(404);
      throw new Error("Order not found");
    }

    
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      res.status(403);
      throw new Error("Not authorized to cancel this order");
    }

    
    if (order.isDelivered) {
      res.status(400);
      throw new Error("Delivered orders cannot be cancelled");
    }

    if (order.isPaid && !order.isDelivered) {
      
      order.status = "Cancelled - Refund Initiated";
    } else {
      order.status = "Cancelled";
    }

  
    for (const item of order.orderItems) {
      const product = await Product.findById(item.product);
      if (product) {
        product.countInStock += item.qty;
        await product.save();
      }
    }

    order.isCancelled = true;
    order.cancelledAt = Date.now();
    
    const updatedOrder = await order.save();

    res.json({
      success: true,
      order: updatedOrder,
      message: "Order cancelled successfully"
    });
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode).json({
      success: false,
      message: error.message
    });
  }
};

const getOrderSummary = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalSales = await Order.aggregate([
      { $group: { _id: null, total: { $sum: "$totalPrice" } } }
    ]);
    
    const ordersByStatus = await Order.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    res.json({
      success: true,
      stats: {
        totalOrders,
        totalSales: totalSales[0]?.total || 0,
        ordersByStatus
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  getOrders,
  cancelOrder,        
  getOrderSummary,    
};