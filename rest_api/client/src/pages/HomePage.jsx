import { Link } from "react-router-dom";

import {
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
} from "lucide-react";

import {
  motion,
  useScroll,
  useTransform,
} from "framer-motion";

import {
  useEffect,
  useState,
} from "react";

import axiosInstance from "../api/axiosInstance";

import ProductCard from "../components/product/ProductCard";

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const { scrollY } = useScroll();

  const y = useTransform(
    scrollY,
    [0, 500],
    [0, 150]
  );

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } =
          await axiosInstance.get(
            "/products?pageSize=4"
          );

        setFeaturedProducts(
          data?.products || []
        );
      } catch (error) {
        console.error(error);

        setFeaturedProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  return (
    <div className="bg-black text-white overflow-hidden">
      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background Image */}
        <motion.div
          style={{ y }}
          className="absolute inset-0"
        >
          <img
            src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1600&auto=format&fit=crop"
            alt="Fashion"
            className="w-full h-full object-cover scale-110"
          />
        </motion.div>

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-black/20"></div>

        {/* Glow */}
        <div className="absolute top-20 left-0 w-[500px] h-[500px] bg-red-700/20 blur-[150px] rounded-full"></div>

        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-red-900/20 blur-[150px] rounded-full"></div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 w-full">
          <motion.div
            initial={{
              opacity: 0,
              y: 100,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 1,
            }}
            className="max-w-3xl"
          >
            {/* Badge */}
            <motion.div
              initial={{
                opacity: 0,
                x: -50,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                delay: 0.3,
              }}
              className="inline-flex items-center gap-2 bg-white/10 border border-white/10 backdrop-blur-xl rounded-full px-6 py-3 mb-8"
            >
              <Sparkles className="text-red-400 w-5 h-5" />

              <span className="uppercase tracking-[4px] text-sm">
                Luxury Collection 2026
              </span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={{
                opacity: 0,
                y: 100,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.4,
                duration: 1,
              }}
              className="text-6xl md:text-8xl lg:text-[120px] leading-none font-serif"
            >
              Define
              <br />

              <span className="text-red-500 italic">
                Your Style
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{
                opacity: 0,
                y: 50,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.8,
              }}
              className="text-white/60 text-lg max-w-xl mt-8 leading-relaxed"
            >
              Elevate your wardrobe with
              timeless luxury fashion crafted
              for modern elegance and premium
              street aesthetics.
            </motion.p>

            {/* Buttons */}
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
                delay: 1,
              }}
              className="flex flex-wrap gap-6 mt-12"
            >
              <Link to="/products">
                <motion.button
                  whileHover={{
                    scale: 1.05,
                  }}
                  whileTap={{
                    scale: 0.95,
                  }}
                  className="bg-red-700 hover:bg-red-600 px-10 py-5 rounded-full text-lg font-semibold flex items-center gap-3 shadow-[0_10px_60px_rgba(220,38,38,0.5)] transition-all duration-500"
                >
                  Shop Collection

                  <ShoppingBag className="w-5 h-5" />
                </motion.button>
              </Link>

              <Link to="/products">
                <motion.button
                  whileHover={{
                    scale: 1.05,
                  }}
                  whileTap={{
                    scale: 0.95,
                  }}
                  className="border border-white/20 bg-white/5 backdrop-blur-xl hover:bg-white hover:text-black px-10 py-5 rounded-full text-lg transition-all duration-500"
                >
                  Explore More
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Text */}
        <motion.div
          animate={{
            y: [0, 20, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 2,
          }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/40 uppercase tracking-[5px] text-sm"
        >
          Scroll To Discover
        </motion.div>
      </section>

      {/* FEATURES */}
      <section className="py-32 px-6 lg:px-10 relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            {
              icon: Truck,
              title: "Free Shipping",
              desc: "Worldwide luxury delivery",
            },

            {
              icon: ShieldCheck,
              title: "Secure Payment",
              desc: "Protected premium checkout",
            },

            {
              icon: RotateCcw,
              title: "Easy Returns",
              desc: "30 days return guarantee",
            },
          ]?.map((item, index) => (
            <motion.div
              key={index}
              initial={{
                opacity: 0,
                y: 80,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{ once: true }}
              transition={{
                delay: index * 0.2,
              }}
              whileHover={{
                y: -10,
              }}
              className="group rounded-[35px] border border-white/10 bg-white/5 backdrop-blur-2xl p-10 hover:border-red-500/30 transition-all duration-500"
            >
              <div className="w-20 h-20 rounded-3xl bg-red-600/10 border border-red-500/20 flex items-center justify-center mb-8 group-hover:bg-red-600 transition-all duration-500">
                <item.icon className="w-9 h-9 text-red-400 group-hover:text-white" />
              </div>

              <h3 className="text-3xl font-serif mb-4">
                {item.title}
              </h3>

              <p className="text-white/50 leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="px-6 lg:px-10 py-24 relative">
        <div className="max-w-7xl mx-auto">
          {/* Heading */}
          <div className="flex flex-col md:flex-row items-center justify-between mb-20">
            <div>
              <p className="uppercase tracking-[5px] text-red-400 text-sm">
                Featured Fashion
              </p>

              <h2 className="text-5xl md:text-7xl font-serif mt-4">
                New Arrivals
              </h2>
            </div>

            <Link
              to="/products"
              className="mt-8 md:mt-0 flex items-center gap-3 text-red-400 hover:text-white transition-all duration-500"
            >
              View All

              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {/* Products */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-10">
              {[1, 2, 3, 4]?.map((i) => (
                <div
                  key={i}
                  className="h-[500px] rounded-[35px] bg-white/5 animate-pulse"
                ></div>
              ))}
            </div>
          ) : featuredProducts?.length >
            0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-10">
              {featuredProducts?.map(
                (product) => (
                  <ProductCard
                    key={
                      product._id
                    }
                    product={product}
                  />
                )
              )}
            </div>
          ) : (
            <div className="text-center py-20">
              <h2 className="text-5xl font-serif">
                No Products Found
              </h2>

              <p className="text-white/40 mt-5">
                Please add products
                from admin panel
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CATEGORY SECTION */}
      <section className="py-32 px-6 lg:px-10 relative">
        <div className="max-w-7xl mx-auto">
          {/* Heading */}
          <div className="text-center mb-20">
            <p className="uppercase tracking-[5px] text-red-400 text-sm">
              Fashion Categories
            </p>

            <h2 className="text-5xl md:text-7xl font-serif mt-4">
              Shop By Style
            </h2>
          </div>

          {/* Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {[
              {
                title:
                  "Streetwear",
                image:
                  "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=1200&auto=format&fit=crop",
              },

              {
                title:
                  "Luxury Wear",
                image:
                  "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=1200&auto=format&fit=crop",
              },
            ]?.map(
              (item, index) => (
                <motion.div
                  key={index}
                  initial={{
                    opacity: 0,
                    y: 80,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  whileHover={{
                    scale: 0.98,
                  }}
                  viewport={{
                    once: true,
                  }}
                  transition={{
                    duration: 0.8,
                  }}
                  className="group relative h-[600px] overflow-hidden rounded-[40px]"
                >
                  {/* Image */}
                  <img
                    src={
                      item.image
                    }
                    alt={
                      item.title
                    }
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2000ms]"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent"></div>

                  {/* Content */}
                  <div className="absolute bottom-12 left-12">
                    <h3 className="text-5xl font-serif">
                      {
                        item.title
                      }
                    </h3>

                    <Link
                      to="/products"
                      className="mt-6 inline-flex items-center gap-3 text-red-400 hover:text-white transition-all duration-500"
                    >
                      Explore
                      Collection

                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </div>
                </motion.div>
              )
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;