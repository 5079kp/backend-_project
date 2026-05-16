import { useEffect, useState } from "react";

import { useLocation } from "react-router-dom";

import axiosInstance from "../api/axiosInstance";

import ProductCard from "../components/product/ProductCard";

import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";

import {
  motion,
  AnimatePresence,
} from "framer-motion";

const ProductPage = () => {
  const [products, setProducts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [pages, setPages] =
    useState(1);

  const [page, setPage] =
    useState(1);

  const location = useLocation();

  const queryParams =
    new URLSearchParams(
      location.search
    );

  const keyword =
    queryParams.get("keyword") || "";

  const category =
    queryParams.get("category") || "";

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);

      try {
        const { data } =
          await axiosInstance.get(
            `/products?keyword=${keyword}&category=${category}&pageNumber=${page}`
          );

        setProducts(
          data?.products || []
        );

        setPages(data?.pages || 1);
      } catch (error) {
        console.error(error);

        setProducts([]);

        setPages(1);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [keyword, category, page]);

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden px-6 lg:px-10 py-32">
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-red-700/10 blur-[150px] rounded-full"></div>

      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-red-900/10 blur-[150px] rounded-full"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* HERO HEADER */}
        <motion.div
          initial={{
            opacity: 0,
            y: 80,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.8,
          }}
          className="flex flex-col xl:flex-row items-start xl:items-end justify-between gap-10 mb-20"
        >
          {/* Left */}
          <div>
            <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 backdrop-blur-xl rounded-full px-6 py-3 mb-8">
              <Sparkles className="text-red-400 w-5 h-5" />

              <span className="uppercase tracking-[4px] text-sm">
                Luxury Fashion Collection
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl xl:text-8xl font-serif leading-none">
              Our
              <br />

              <span className="text-red-500 italic">
                Collection
              </span>
            </h1>

            <p className="text-white/50 mt-8 max-w-xl text-lg">
              {keyword
                ? `Showing luxury results for "${keyword}"`
                : category
                ? `Explore premium ${category} fashion collection`
                : "Discover timeless fashion pieces crafted for luxury and elegance."}
            </p>
          </div>

          {/* Filter */}
          <motion.div
            whileHover={{
              y: -5,
            }}
            className="flex items-center gap-4 border border-white/10 bg-white/5 backdrop-blur-2xl rounded-full px-6 py-4"
          >
            <Filter className="text-red-400 w-5 h-5" />

            <select
              className="bg-transparent outline-none text-white"
              onChange={(e) => {
                const value =
                  e.target.value;

                window.location.href =
                  value ===
                  "All Categories"
                    ? "/products"
                    : `/products?category=${value}`;
              }}
              value={
                category ||
                "All Categories"
              }
            >
              <option className="bg-black">
                All Categories
              </option>

              <option
                value="Fashion"
                className="bg-black"
              >
                Fashion
              </option>

              <option
                value="Streetwear"
                className="bg-black"
              >
                Streetwear
              </option>

              <option
                value="Luxury"
                className="bg-black"
              >
                Luxury
              </option>

              <option
                value="Accessories"
                className="bg-black"
              >
                Accessories
              </option>
            </select>
          </motion.div>
        </motion.div>

        {/* PRODUCTS */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-10"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8]?.map(
                (i) => (
                  <div
                    key={i}
                    className="h-[550px] rounded-[35px] bg-white/5 animate-pulse border border-white/5"
                  ></div>
                )
              )}
            </motion.div>
          ) : products?.length ===
            0 ? (
            /* EMPTY */
            <motion.div
              initial={{
                opacity: 0,
                y: 80,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              className="text-center py-32 border border-white/10 bg-white/5 backdrop-blur-2xl rounded-[50px]"
            >
              <div className="w-32 h-32 rounded-full bg-red-600/10 border border-red-500/20 flex items-center justify-center mx-auto mb-10">
                <Search className="w-16 h-16 text-red-400" />
              </div>

              <h2 className="text-5xl font-serif">
                No Products Found
              </h2>

              <p className="text-white/50 mt-5 text-lg">
                Try changing your filters or
                search terms.
              </p>
            </motion.div>
          ) : (
            <>
              {/* Product Grid */}
              <motion.div
                layout
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-10"
              >
                {products?.map(
                  (product) => (
                    <ProductCard
                      key={
                        product._id
                      }
                      product={
                        product
                      }
                    />
                  )
                )}
              </motion.div>

              {/* Pagination */}
              {pages > 1 && (
                <motion.div
                  initial={{
                    opacity: 0,
                    y: 50,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  className="flex justify-center items-center gap-4 mt-24"
                >
                  {/* Prev */}
                  <motion.button
                    whileHover={{
                      scale: 1.08,
                    }}
                    whileTap={{
                      scale: 0.95,
                    }}
                    disabled={
                      page === 1
                    }
                    onClick={() =>
                      setPage(
                        (prev) =>
                          prev - 1
                      )
                    }
                    className="w-14 h-14 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl flex items-center justify-center disabled:opacity-40 hover:bg-red-600 transition-all duration-500"
                  >
                    <ChevronLeft />
                  </motion.button>

                  {/* Numbers */}
                  {[...
                    Array(
                      pages || 1
                    ).keys(),
                  ]?.map((x) => (
                    <motion.button
                      whileHover={{
                        scale: 1.08,
                      }}
                      whileTap={{
                        scale: 0.95,
                      }}
                      key={x + 1}
                      onClick={() =>
                        setPage(
                          x + 1
                        )
                      }
                      className={`w-14 h-14 rounded-full font-semibold transition-all duration-500 ${
                        page ===
                        x + 1
                          ? "bg-red-600 text-white shadow-[0_10px_40px_rgba(220,38,38,0.5)]"
                          : "border border-white/10 bg-white/5 hover:bg-white hover:text-black"
                      }`}
                    >
                      {x + 1}
                    </motion.button>
                  ))}

                  {/* Next */}
                  <motion.button
                    whileHover={{
                      scale: 1.08,
                    }}
                    whileTap={{
                      scale: 0.95,
                    }}
                    disabled={
                      page ===
                      pages
                    }
                    onClick={() =>
                      setPage(
                        (prev) =>
                          prev + 1
                      )
                    }
                    className="w-14 h-14 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl flex items-center justify-center disabled:opacity-40 hover:bg-red-600 transition-all duration-500"
                  >
                    <ChevronRight />
                  </motion.button>
                </motion.div>
              )}
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ProductPage;