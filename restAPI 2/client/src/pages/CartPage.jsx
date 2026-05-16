import { useCart } from "../context/CartContext";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  Trash2,
  Minus,
  Plus,
  ShoppingBag,
  ArrowRight,
} from "lucide-react";

import { motion } from "framer-motion";

const CartPage = () => {
  const {
    cartItems,
    addToCart,
    removeFromCart,
    cartTotal,
    clearCart,
  } = useCart();

  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate("/checkout");
  };

  // Empty Cart
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-6 relative overflow-hidden">
        {/* Background Glow */}
        <div className="absolute w-[500px] h-[500px] bg-red-700/20 blur-[140px] rounded-full"></div>

        <motion.div
          initial={{
            opacity: 0,
            scale: 0.8,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          transition={{
            duration: 0.8,
          }}
          className="relative z-10 text-center space-y-8"
        >
          <div className="w-40 h-40 mx-auto rounded-full bg-white/5 backdrop-blur-2xl border border-white/10 flex items-center justify-center shadow-[0_20px_80px_rgba(0,0,0,0.6)]">
            <ShoppingBag className="w-20 h-20 text-red-500" />
          </div>

          <div>
            <h1 className="text-5xl md:text-6xl font-serif">
              Your Cart Is Empty
            </h1>

            <p className="text-white/50 mt-4 text-lg">
              Discover premium fashion collections
              and add your favorites.
            </p>
          </div>

          <Link to="/products">
            <motion.button
              whileHover={{
                scale: 1.05,
              }}
              whileTap={{
                scale: 0.95,
              }}
              className="bg-red-700 hover:bg-red-600 px-10 py-5 rounded-full text-lg font-semibold flex items-center gap-3 mx-auto transition-all duration-500 shadow-[0_10px_50px_rgba(220,38,38,0.4)]"
            >
              Start Shopping

              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white px-6 lg:px-10 py-32 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-red-700/10 blur-[150px] rounded-full"></div>

      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-red-900/10 blur-[150px] rounded-full"></div>

      {/* Heading */}
      <motion.div
        initial={{
          opacity: 0,
          y: 50,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.8,
        }}
        className="flex flex-col md:flex-row items-center justify-between mb-16 relative z-10"
      >
        <div>
          <p className="uppercase tracking-[5px] text-red-400 text-sm">
            Luxury Fashion Cart
          </p>

          <h1 className="text-5xl md:text-7xl font-serif mt-3">
            Shopping Cart
          </h1>
        </div>

        <button
          onClick={clearCart}
          className="mt-6 md:mt-0 border border-red-500 text-red-500 hover:bg-red-600 hover:text-white px-8 py-3 rounded-full transition-all duration-500"
        >
          Clear Cart
        </button>
      </motion.div>

      {/* Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-12 relative z-10">
        {/* Cart Items */}
        <div className="xl:col-span-2 space-y-8">
          {cartItems.map((item, index) => (
            <motion.div
              key={item.product._id}
              initial={{
                opacity: 0,
                y: 100,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: index * 0.1,
                duration: 0.7,
              }}
              whileHover={{
                y: -8,
              }}
              className="group relative overflow-hidden rounded-[35px] border border-white/10 bg-white/5 backdrop-blur-2xl p-6 md:p-8 shadow-[0_20px_80px_rgba(0,0,0,0.4)]"
            >
              {/* Glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-red-700/0 via-red-700/5 to-red-700/0 opacity-0 group-hover:opacity-100 transition-all duration-700"></div>

              <div className="relative flex flex-col lg:flex-row items-center gap-8">
                {/* Image */}
                <div className="w-full lg:w-56 h-72 rounded-[30px] overflow-hidden">
                  <motion.img
                    whileHover={{
                      scale: 1.08,
                    }}
                    transition={{
                      duration: 0.7,
                    }}
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 space-y-4">
                  <span className="uppercase tracking-[4px] text-red-400 text-xs">
                    {item.product.category}
                  </span>

                  <h2 className="text-3xl font-semibold">
                    {item.product.name}
                  </h2>

                  <p className="text-white/50 leading-relaxed">
                    Premium luxury fashion crafted
                    for elegance and modern style.
                  </p>

                  <h3 className="text-4xl font-bold">
                    ${item.product.price}
                  </h3>
                </div>

                {/* Actions */}
                <div className="flex flex-col items-center gap-6">
                  {/* Quantity */}
                  <div className="flex items-center gap-5 bg-white/5 border border-white/10 px-5 py-4 rounded-full backdrop-blur-xl">
                    <button
                      onClick={() =>
                        addToCart(
                          item.product,
                          Math.max(1, item.qty - 1)
                        )
                      }
                      className="hover:text-red-400 transition-all"
                    >
                      <Minus className="w-5 h-5" />
                    </button>

                    <span className="text-xl font-bold w-8 text-center">
                      {item.qty}
                    </span>

                    <button
                      onClick={() =>
                        addToCart(
                          item.product,
                          Math.min(
                            item.product.stock,
                            item.qty + 1
                          )
                        )
                      }
                      className="hover:text-red-400 transition-all"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Delete */}
                  <button
                    onClick={() =>
                      removeFromCart(
                        item.product._id
                      )
                    }
                    className="w-14 h-14 rounded-full border border-red-500/30 bg-red-500/10 hover:bg-red-600 hover:text-white transition-all duration-500 flex items-center justify-center"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Summary */}
        <motion.div
          initial={{
            opacity: 0,
            x: 100,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          transition={{
            duration: 0.8,
          }}
          className="sticky top-32 h-fit"
        >
          <div className="rounded-[40px] border border-white/10 bg-white/5 backdrop-blur-2xl p-10 shadow-[0_20px_80px_rgba(0,0,0,0.5)]">
            <h2 className="text-4xl font-serif mb-10">
              Order Summary
            </h2>

            <div className="space-y-6 text-white/70">
              <div className="flex justify-between text-lg">
                <span>Subtotal</span>

                <span className="text-white font-semibold">
                  ${cartTotal.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between text-lg">
                <span>Shipping</span>

                <span className="text-green-400">
                  Free
                </span>
              </div>

              <div className="flex justify-between text-lg">
                <span>Tax</span>

                <span>$0.00</span>
              </div>

              <div className="border-t border-white/10 pt-6 flex justify-between items-center">
                <span className="text-2xl font-semibold">
                  Total
                </span>

                <span className="text-5xl font-bold text-red-500">
                  ${cartTotal.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Checkout */}
            <motion.button
              whileHover={{
                scale: 1.03,
              }}
              whileTap={{
                scale: 0.95,
              }}
              onClick={handleCheckout}
              className="w-full mt-10 bg-red-700 hover:bg-red-600 py-5 rounded-full text-lg font-semibold flex items-center justify-center gap-3 transition-all duration-500 shadow-[0_10px_60px_rgba(220,38,38,0.5)]"
            >
              Checkout Now

              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CartPage;