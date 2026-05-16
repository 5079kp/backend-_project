import Cart from "../models/Cart.js";
import Product from "../models/Product.js"; 

//
const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id })
      .populate("cartItems.product");
    
    if (!cart) {
      
      return res.json({
        _id: null,
        user: req.user._id,
        cartItems: [],
        totalPrice: 0,
        message: "Cart is empty"
      });
    }
    
    // Added: Calculate total price
    const totalPrice = cart.cartItems.reduce((total, item) => {
      if (item.product && item.product.price) {
        return total + (item.product.price * item.qty);
      }
      return total;
    }, 0);
    
    res.json({
      ...cart.toObject(),
      totalPrice
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
const addToCart = async (req, res) => {
  try {
    const { productId, qty } = req.body;
    
    // Fixed: Validate input
    if (!productId || !qty) {
      res.status(400);
      throw new Error("Product ID and quantity are required");
    }
    
    if (qty < 1) {
      res.status(400);
      throw new Error("Quantity must be at least 1");
    }
    
    // Fixed: Check if product exists and has stock
    const product = await Product.findById(productId);
    
    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }
    
    if (product.countInStock < qty) {
      res.status(400);
      throw new Error(`Only ${product.countInStock} items in stock`);
    }
    
    let cart = await Cart.findOne({ user: req.user._id });
    
    if (!cart) {
      // Create new cart if doesn't exist
      cart = await Cart.create({
        user: req.user._id,
        cartItems: [{ product: productId, qty }],
      });
    } else {
      const itemIndex = cart.cartItems.findIndex(
        (item) => item.product.toString() === productId
      );
      
      if (itemIndex > -1) {
        // Fixed: Check stock when updating quantity
        const newQty = qty;
        if (product.countInStock < newQty) {
          res.status(400);
          throw new Error(`Only ${product.countInStock} items in stock`);
        }
        cart.cartItems[itemIndex].qty = newQty;
      } else {
        cart.cartItems.push({ product: productId, qty });
      }
      
      await cart.save();
    }
    
    // Fixed: Populate and calculate total
    const updatedCart = await Cart.findById(cart._id)
      .populate("cartItems.product");
    
    const totalPrice = updatedCart.cartItems.reduce((total, item) => {
      if (item.product && item.product.price) {
        return total + (item.product.price * item.qty);
      }
      return total;
    }, 0);
    
    res.status(201).json({
      success: true,
      cart: updatedCart,
      totalPrice
    });
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode).json({
      success: false,
      message: error.message
    });
  }
};
const updateCartItemQty = async (req, res) => {
  try {
    const { qty } = req.body;
    const { productId } = req.params;
    
    if (!qty || qty < 1) {
      res.status(400);
      throw new Error("Valid quantity is required");
    }
    
    const cart = await Cart.findOne({ user: req.user._id });
    
    if (!cart) {
      res.status(404);
      throw new Error("Cart not found");
    }
    
    const itemIndex = cart.cartItems.findIndex(
      (item) => item.product.toString() === productId
    );
    
    if (itemIndex === -1) {
      res.status(404);
      throw new Error("Item not found in cart");
    }
    
    // Check stock
    const product = await Product.findById(productId);
    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }
    
    if (product.countInStock < qty) {
      res.status(400);
      throw new Error(`Only ${product.countInStock} items in stock`);
    }
    
    cart.cartItems[itemIndex].qty = qty;
    await cart.save();
    
    const updatedCart = await Cart.findById(cart._id)
      .populate("cartItems.product");
    
    const totalPrice = updatedCart.cartItems.reduce((total, item) => {
      if (item.product && item.product.price) {
        return total + (item.product.price * item.qty);
      }
      return total;
    }, 0);
    
    res.json({
      success: true,
      cart: updatedCart,
      totalPrice
    });
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode).json({
      success: false,
      message: error.message
    });
  }
};


const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    
    if (!productId) {
      res.status(400);
      throw new Error("Product ID is required");
    }
    
    const cart = await Cart.findOne({ user: req.user._id });
    
    if (!cart) {
      res.status(404);
      throw new Error("Cart not found");
    }
    
    const initialLength = cart.cartItems.length;
    
    cart.cartItems = cart.cartItems.filter(
      (item) => item.product.toString() !== productId
    );
    
    if (cart.cartItems.length === initialLength) {
      res.status(404);
      throw new Error("Item not found in cart");
    }
    
    await cart.save();
    
    const updatedCart = await Cart.findById(cart._id)
      .populate("cartItems.product");
    
    const totalPrice = updatedCart.cartItems.reduce((total, item) => {
      if (item.product && item.product.price) {
        return total + (item.product.price * item.qty);
      }
      return total;
    }, 0);
    
    res.json({
      success: true,
      cart: updatedCart,
      totalPrice,
      message: "Item removed from cart"
    });
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode).json({
      success: false,
      message: error.message
    });
  }
};

const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    
    if (!cart) {
      res.status(404);
      throw new Error("Cart not found");
    }
    
    // Clear cart
    await Cart.findByIdAndDelete(cart._id);
    
    res.json({
      success: true,
      message: "Cart cleared successfully"
    });
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode).json({
      success: false,
      message: error.message
    });
  }
};

const getCartItemCount = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    
    const itemCount = cart 
      ? cart.cartItems.reduce((total, item) => total + item.qty, 0)
      : 0;
    
    res.json({
      success: true,
      count: itemCount
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export {
  getCart,
  addToCart,
  updateCartItemQty,
  removeFromCart,
  clearCart,
  getCartItemCount,
};