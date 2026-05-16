import { Link } from "react-router-dom";
import { ShoppingBag, Star, Heart, Eye } from "lucide-react";
import { motion } from "framer-motion";
import { useCart } from "../../context/CartContext";
import { toast } from "react-toastify";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  // Early return if product is missing
  if (!product) {
    return null;
  }

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent event from bubbling to Link
    
    if (product.stock <= 0) {
      toast.error(`${product.name} is out of stock`);
      return;
    }
    
    addToCart(product, 1);
    toast.success(`${product.name} added to cart`, {
      position: "bottom-right",
      autoClose: 2000,
    });
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toast.info(`${product.name} added to wishlist`);
    // Add your wishlist logic here
  };

  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Add your quick view logic here
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 80 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      whileHover={{ y: -15 }}
      className="group relative"
    >
      <Link
        to={`/product/${product._id}`}
        className="relative block overflow-hidden rounded-[32px] bg-black/40 backdrop-blur-2xl border border-white/10 shadow-[0_20px_80px_rgba(0,0,0,0.4)]"
      >
        {/* Image Section */}
        <div className="relative overflow-hidden h-[420px]">
          <motion.img
            src={product?.images?.[0] || "https://via.placeholder.com/500x500?text=No+Image"}
            alt={product.name || "Product image"}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 0.8 }}
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/500x500?text=Image+Not+Found";
            }}
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80"></div>

          {/* Floating Icons */}
          <div className="absolute top-5 right-5 flex flex-col gap-3 opacity-0 translate-x-10 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
            <button 
              onClick={handleWishlist}
              className="w-11 h-11 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white hover:bg-red-600 transition-all duration-300"
              aria-label="Add to wishlist"
            >
              <Heart className="w-5 h-5" />
            </button>

            <button 
              onClick={handleQuickView}
              className="w-11 h-11 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-300"
              aria-label="Quick view"
            >
              <Eye className="w-5 h-5" />
            </button>
          </div>

          {/* Add To Cart Button */}
          {product.stock > 0 && (
            <motion.button
              onClick={handleAddToCart}
              whileTap={{ scale: 0.9 }}
              className="absolute bottom-6 left-1/2 -translate-x-1/2 translate-y-20 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 bg-white text-black px-8 py-3 rounded-full flex items-center gap-2 font-semibold tracking-wide transition-all duration-500 hover:bg-red-600 hover:text-white"
              aria-label="Add to cart"
            >
              <ShoppingBag className="w-5 h-5" />
              Add To Cart
            </motion.button>
          )}

          {/* Rating Badge */}
          <div className="absolute top-5 left-5 bg-black/40 backdrop-blur-xl border border-white/10 px-3 py-1 rounded-full flex items-center gap-1 text-white text-sm">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span>{product?.rating ? product.rating.toFixed(1) : '5.0'}</span>
          </div>

          {/* Out of Stock Overlay */}
          {product.stock <= 0 && (
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center">
              <span className="border border-red-500 text-red-500 px-6 py-3 rounded-full uppercase tracking-[4px] text-sm font-semibold">
                Out Of Stock
              </span>
            </div>
          )}

          {/* Low Stock Badge (optional) */}
          {product.stock > 0 && product.stock <= 5 && (
            <div className="absolute bottom-6 left-5 bg-orange-500/90 backdrop-blur-xl px-3 py-1 rounded-full text-xs font-semibold">
              Only {product.stock} left!
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6 text-white">
          {/* Category */}
          <span className="text-xs uppercase tracking-[4px] text-red-400">
            {product.category || "Uncategorized"}
          </span>

          {/* Product Name */}
          <h3 className="mt-3 text-2xl font-semibold tracking-wide line-clamp-2 group-hover:text-red-400 transition-all duration-500">
            {product.name}
          </h3>

          {/* Bottom Section */}
          <div className="mt-6 flex items-center justify-between">
            {/* Price */}
            <div>
              <p className="text-white/50 text-sm">Starting From</p>
              <h4 className="text-3xl font-bold">
                ${typeof product.price === 'number' 
                  ? product.price.toFixed(2) 
                  : product.price}
              </h4>
            </div>

            {/* Premium Badge */}
            <div className="px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl text-xs uppercase tracking-[3px] whitespace-nowrap">
              {product.isPremium ? "Premium" : "Luxury"}
            </div>
          </div>
        </div>

        {/* Glow Border Effect */}
        <div className="absolute inset-0 rounded-[32px] border border-white/5 group-hover:border-red-500/40 transition-all duration-500 pointer-events-none"></div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;