import { useState } from "react";

import { useCart } from "../context/CartContext";

import { useNavigate } from "react-router-dom";

import axiosInstance from "../api/axiosInstance";

import { toast } from "react-toastify";

import {
  MapPin,
  CreditCard,
  ShoppingBag,
  Truck,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";

import { motion } from "framer-motion";

const CheckoutPage = () => {
  const {
    cartItems,
    cartTotal,
    clearCart,
  } = useCart();

  const navigate = useNavigate();

  const [address, setAddress] = useState("");

  const [city, setCity] = useState("");

  const [postalCode, setPostalCode] =
    useState("");

  const [country, setCountry] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const orderData = {
        orderItems: cartItems,

        shippingAddress: {
          address,
          city,
          postalCode,
          country,
        },

        paymentMethod: "COD",

        itemsPrice: cartTotal,

        taxPrice: 0,

        shippingPrice: 0,

        totalPrice: cartTotal,
      };

      await axiosInstance.post(
        "/orders",
        orderData
      );

      toast.success(
        "Order placed successfully!"
      );

      clearCart();

      navigate("/profile");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Order failed"
      );
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0)
    return navigate("/cart");

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden px-6 lg:px-10 py-32">
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-red-700/10 blur-[150px] rounded-full"></div>

      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-red-900/10 blur-[150px] rounded-full"></div>

      {/* Header */}
      <motion.div
        initial={{
          opacity: 0,
          y: 60,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.8,
        }}
        className="text-center mb-20 relative z-10"
      >
        <p className="uppercase tracking-[6px] text-red-400 text-sm">
          Luxury Fashion Checkout
        </p>

        <h1 className="text-5xl md:text-7xl font-serif mt-4">
          Secure Checkout
        </h1>

        <p className="text-white/50 mt-5 max-w-2xl mx-auto">
          Complete your premium fashion order
          with secure delivery and elegant
          shopping experience.
        </p>
      </motion.div>

      {/* Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-14 relative z-10">
        {/* Left Side */}
        <motion.div
          initial={{
            opacity: 0,
            x: -100,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          transition={{
            duration: 0.9,
          }}
          className="space-y-10"
        >
          {/* Shipping */}
          <div className="rounded-[40px] border border-white/10 bg-white/5 backdrop-blur-2xl p-10 shadow-[0_20px_80px_rgba(0,0,0,0.5)]">
            <div className="flex items-center gap-5 mb-10">
              <div className="w-16 h-16 rounded-2xl bg-red-600/20 border border-red-500/20 flex items-center justify-center">
                <MapPin className="w-7 h-7 text-red-400" />
              </div>

              <div>
                <p className="uppercase tracking-[4px] text-red-400 text-xs">
                  Delivery Details
                </p>

                <h2 className="text-3xl font-serif">
                  Shipping Address
                </h2>
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-8"
            >
              {/* Address */}
              <div>
                <label className="text-white/70 block mb-3 uppercase tracking-[3px] text-xs">
                  Street Address
                </label>

                <input
                  type="text"
                  required
                  placeholder="Enter your address"
                  value={address}
                  onChange={(e) =>
                    setAddress(e.target.value)
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 outline-none focus:border-red-500 transition-all text-white placeholder:text-white/30"
                />
              </div>

              {/* City & Postal */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-white/70 block mb-3 uppercase tracking-[3px] text-xs">
                    City
                  </label>

                  <input
                    type="text"
                    required
                    placeholder="City"
                    value={city}
                    onChange={(e) =>
                      setCity(e.target.value)
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 outline-none focus:border-red-500 transition-all text-white placeholder:text-white/30"
                  />
                </div>

                <div>
                  <label className="text-white/70 block mb-3 uppercase tracking-[3px] text-xs">
                    Postal Code
                  </label>

                  <input
                    type="text"
                    required
                    placeholder="123456"
                    value={postalCode}
                    onChange={(e) =>
                      setPostalCode(
                        e.target.value
                      )
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 outline-none focus:border-red-500 transition-all text-white placeholder:text-white/30"
                  />
                </div>
              </div>

              {/* Country */}
              <div>
                <label className="text-white/70 block mb-3 uppercase tracking-[3px] text-xs">
                  Country
                </label>

                <input
                  type="text"
                  required
                  placeholder="Country"
                  value={country}
                  onChange={(e) =>
                    setCountry(e.target.value)
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 outline-none focus:border-red-500 transition-all text-white placeholder:text-white/30"
                />
              </div>
            </form>
          </div>

          {/* Payment */}
          <div className="rounded-[40px] border border-white/10 bg-white/5 backdrop-blur-2xl p-10 shadow-[0_20px_80px_rgba(0,0,0,0.5)]">
            <div className="flex items-center gap-5 mb-10">
              <div className="w-16 h-16 rounded-2xl bg-red-600/20 border border-red-500/20 flex items-center justify-center">
                <CreditCard className="w-7 h-7 text-red-400" />
              </div>

              <div>
                <p className="uppercase tracking-[4px] text-red-400 text-xs">
                  Payment Option
                </p>

                <h2 className="text-3xl font-serif">
                  Payment Method
                </h2>
              </div>
            </div>

            {/* COD Card */}
            <motion.div
              whileHover={{
                y: -5,
              }}
              className="rounded-[30px] border border-red-500/20 bg-gradient-to-r from-red-600/10 to-black p-8 flex items-center justify-between"
            >
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-center">
                  <Truck className="text-red-400 w-7 h-7" />
                </div>

                <div>
                  <h3 className="text-2xl font-semibold">
                    Cash On Delivery
                  </h3>

                  <p className="text-white/50 mt-1">
                    Pay securely when your order
                    arrives.
                  </p>
                </div>
              </div>

              <CheckCircle2 className="text-red-400 w-10 h-10" />
            </motion.div>
          </div>
        </motion.div>

        {/* Right Side */}
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
            duration: 0.9,
          }}
          className="sticky top-28 h-fit"
        >
          <div className="rounded-[40px] border border-white/10 bg-white/5 backdrop-blur-2xl p-10 shadow-[0_20px_80px_rgba(0,0,0,0.5)]">
            {/* Header */}
            <div className="flex items-center gap-5 mb-10">
              <div className="w-16 h-16 rounded-2xl bg-red-600/20 border border-red-500/20 flex items-center justify-center">
                <ShoppingBag className="w-7 h-7 text-red-400" />
              </div>

              <div>
                <p className="uppercase tracking-[4px] text-red-400 text-xs">
                  Your Order
                </p>

                <h2 className="text-3xl font-serif">
                  Order Summary
                </h2>
              </div>
            </div>

            {/* Products */}
            <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2">
              {cartItems.map((item, index) => (
                <motion.div
                  key={item.product._id}
                  initial={{
                    opacity: 0,
                    y: 40,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay: index * 0.1,
                  }}
                  className="flex items-center justify-between gap-5 border border-white/5 bg-black/20 rounded-[30px] p-5"
                >
                  <div className="flex items-center gap-5">
                    <div className="w-24 h-24 rounded-[25px] overflow-hidden">
                      <img
                        src={
                          item.product.images[0]
                        }
                        alt={
                          item.product.name
                        }
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold">
                        {
                          item.product.name
                        }
                      </h3>

                      <p className="text-white/40 mt-1">
                        Qty: {item.qty}
                      </p>

                      <p className="text-red-400 mt-2">
                        $
                        {
                          item.product.price
                        }
                      </p>
                    </div>
                  </div>

                  <h4 className="text-2xl font-bold">
                    $
                    {(
                      item.qty *
                      item.product.price
                    ).toFixed(2)}
                  </h4>
                </motion.div>
              ))}
            </div>

            {/* Price */}
            <div className="mt-10 space-y-5 border-t border-white/10 pt-8">
              <div className="flex justify-between text-white/60">
                <span>Subtotal</span>

                <span>
                  $
                  {cartTotal.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between text-white/60">
                <span>Shipping</span>

                <span className="text-green-400">
                  Free
                </span>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-white/10">
                <span className="text-2xl font-semibold">
                  Total
                </span>

                <span className="text-5xl font-bold text-red-500">
                  $
                  {cartTotal.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Security */}
            <div className="mt-8 flex items-center gap-3 text-white/40 text-sm">
              <ShieldCheck className="w-5 h-5 text-green-400" />

              Secure encrypted checkout
            </div>

            {/* Button */}
            <motion.button
              whileHover={{
                scale: 1.03,
              }}
              whileTap={{
                scale: 0.95,
              }}
              onClick={handleSubmit}
              disabled={
                loading ||
                !address ||
                !city ||
                !postalCode ||
                !country
              }
              className="w-full mt-10 bg-red-700 hover:bg-red-600 py-6 rounded-full text-xl font-semibold transition-all duration-500 shadow-[0_10px_60px_rgba(220,38,38,0.5)] disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {loading ? (
                "Placing Order..."
              ) : (
                <>
                  Confirm Order

                  <CheckCircle2 className="w-6 h-6" />
                </>
              )}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CheckoutPage;