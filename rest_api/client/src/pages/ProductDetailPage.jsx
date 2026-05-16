import { useEffect, useState } from "react";

import {
  useParams,
  useNavigate,
} from "react-router-dom";

import axiosInstance from "../Api/axiosInstance";

import { useCart } from "../context/CartContext";

import {
  ShoppingBag,
  Star,
  Minus,
  Plus,
  ChevronLeft,
  ShieldCheck,
  Truck,
  RotateCcw,
  Heart,
  Eye,
} from "lucide-react";

import { toast } from "react-toastify";

import { motion } from "framer-motion";

const ProductDetailPage = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const [product, setProduct] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [qty, setQty] = useState(1);

  const [selectedImage, setSelectedImage] =
    useState(0);

  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);

      try {
        const { data } =
          await axiosInstance.get(
            `/products/${id}`
          );

        setProduct(data);
      } catch (error) {
        toast.error("Product not found");

        navigate("/products");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  const handleAddToCart = () => {
    addToCart(product, qty);

    toast.success(
      `${product.name} added to cart`
    );
  };

  if (loading)
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <motion.div
          animate={{
            opacity: [0.3, 1, 0.3],
          }}
          transition={{
            repeat: Infinity,
            duration: 1.5,
          }}
          className="text-4xl font-serif"
        >
          Loading Luxury Product...
        </motion.div>
      </div>
    );

  if (!product) return null;

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative px-6 lg:px-10 py-32">
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-red-700/10 blur-[150px] rounded-full"></div>

      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-red-900/10 blur-[150px] rounded-full"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Back Button */}
        <motion.button
          whileHover={{
            x: -5,
          }}
          onClick={() => navigate(-1)}
          className="flex items-center gap-3 text-white/50 hover:text-white mb-14 transition-all"
        >
          <ChevronLeft className="w-5 h-5" />

          Back To Collection
        </motion.button>

        {/* Main Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-16 items-start">
          {/* LEFT SIDE */}
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
              duration: 0.8,
            }}
            className="space-y-8"
          >
            {/* Main Image */}
            <div className="relative overflow-hidden rounded-[40px] border border-white/10 bg-white/5 backdrop-blur-2xl">
              {/* Icons */}
              <div className="absolute top-6 right-6 z-20 flex flex-col gap-4">
                <button className="w-14 h-14 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 flex items-center justify-center hover:bg-red-600 transition-all duration-500">
                  <Heart className="w-5 h-5" />
                </button>

                <button className="w-14 h-14 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all duration-500">
                  <Eye className="w-5 h-5" />
                </button>
              </div>

              {/* Product Image */}
              <motion.img
                key={selectedImage}
                initial={{
                  opacity: 0,
                  scale: 1.1,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                transition={{
                  duration: 0.7,
                }}
                src={
                  product.images[
                    selectedImage
                  ]
                }
                alt={product.name}
                className="w-full h-[750px] object-cover hover:scale-105 transition-all duration-[2000ms]"
              />

              {/* Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
            </div>

            {/* Thumbnails */}
            <div className="flex gap-5 overflow-x-auto pb-2">
              {product.images.map(
                (img, index) => (
                  <motion.button
                    whileHover={{
                      y: -5,
                    }}
                    key={index}
                    onClick={() =>
                      setSelectedImage(
                        index
                      )
                    }
                    className={`relative min-w-[120px] h-[140px] rounded-[25px] overflow-hidden border transition-all duration-500 ${
                      selectedImage ===
                      index
                        ? "border-red-500 scale-105"
                        : "border-white/10 opacity-60"
                    }`}
                  >
                    <img
                      src={img}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </motion.button>
                )
              )}
            </div>
          </motion.div>

          {/* RIGHT SIDE */}
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
            className="space-y-10 sticky top-28"
          >
            {/* Category */}
            <div>
              <p className="uppercase tracking-[5px] text-red-400 text-sm">
                {product.category}
              </p>

              <h1 className="text-5xl md:text-7xl font-serif leading-tight mt-5">
                {product.name}
              </h1>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-5 py-3">
                <Star className="fill-yellow-400 text-yellow-400 w-5 h-5" />

                <span className="font-semibold">
                  {product.rating || 5}
                </span>
              </div>

              <span className="text-white/40">
                {product.numReviews ||
                  120}{" "}
                Reviews
              </span>
            </div>

            {/* Price */}
            <div className="flex items-end gap-4">
              <h2 className="text-6xl font-bold text-red-500">
                ${product.price}
              </h2>

              <span className="line-through text-white/30 text-2xl">
                $
                {(
                  product.price + 120
                ).toFixed(0)}
              </span>
            </div>

            {/* Description */}
            <p className="text-white/60 leading-relaxed text-lg">
              {product.description}
            </p>

            {/* Quantity */}
            <div className="space-y-5 border-t border-white/10 pt-10">
              <div className="flex items-center justify-between">
                <span className="uppercase tracking-[4px] text-sm text-white/50">
                  Quantity
                </span>

                <div className="flex items-center gap-6 bg-white/5 border border-white/10 px-6 py-4 rounded-full">
                  <button
                    onClick={() =>
                      setQty((prev) =>
                        Math.max(
                          1,
                          prev - 1
                        )
                      )
                    }
                    className="hover:text-red-400 transition-all"
                  >
                    <Minus className="w-5 h-5" />
                  </button>

                  <span className="text-2xl font-bold w-10 text-center">
                    {qty}
                  </span>

                  <button
                    onClick={() =>
                      setQty((prev) =>
                        Math.min(
                          product.stock,
                          prev + 1
                        )
                      )
                    }
                    className="hover:text-red-400 transition-all"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Stock */}
              <div className="flex items-center justify-between">
                <span className="uppercase tracking-[4px] text-sm text-white/50">
                  Availability
                </span>

                <span
                  className={`font-semibold ${
                    product.stock > 0
                      ? "text-green-400"
                      : "text-red-500"
                  }`}
                >
                  {product.stock > 0
                    ? `In Stock (${product.stock})`
                    : "Out Of Stock"}
                </span>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col md:flex-row gap-6">
              <motion.button
                whileHover={{
                  scale: 1.03,
                }}
                whileTap={{
                  scale: 0.95,
                }}
                onClick={handleAddToCart}
                disabled={
                  product.stock <= 0
                }
                className="flex-1 bg-red-700 hover:bg-red-600 py-6 rounded-full text-xl font-semibold flex items-center justify-center gap-3 transition-all duration-500 shadow-[0_10px_60px_rgba(220,38,38,0.5)] disabled:opacity-50"
              >
                <ShoppingBag className="w-6 h-6" />

                Add To Cart
              </motion.button>

              <motion.button
                whileHover={{
                  scale: 1.03,
                }}
                whileTap={{
                  scale: 0.95,
                }}
                className="px-10 py-6 rounded-full border border-white/10 bg-white/5 hover:bg-white hover:text-black transition-all duration-500"
              >
                Buy Now
              </motion.button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-5 pt-12 border-t border-white/10">
              {[
                {
                  icon: Truck,
                  text: "Free Shipping",
                },

                {
                  icon: ShieldCheck,
                  text: "Secure Payment",
                },

                {
                  icon: RotateCcw,
                  text: "Easy Returns",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  whileHover={{
                    y: -8,
                  }}
                  className="rounded-[30px] border border-white/10 bg-white/5 backdrop-blur-xl p-6 text-center"
                >
                  <item.icon className="w-8 h-8 mx-auto text-red-400 mb-4" />

                  <p className="text-sm text-white/70 uppercase tracking-[3px]">
                    {item.text}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;