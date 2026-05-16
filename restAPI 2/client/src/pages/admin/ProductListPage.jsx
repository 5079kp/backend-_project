import {
  useEffect,
  useState,
} from "react";

import { Link } from "react-router-dom";

import axiosInstance from "../../Api/axiosInstance";

import { toast } from "react-toastify";

import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Boxes,
  Sparkles,
  Crown,
  ChevronRight,
} from "lucide-react";

import { motion } from "framer-motion";

const ProductListPage = () => {
  const [products, setProducts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const fetchProducts = async () => {
    try {
      const { data } =
        await axiosInstance.get(
          "/products"
        );

      setProducts(data.products);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const deleteHandler = async (id) => {
    if (
      window.confirm(
        "Delete this product?"
      )
    ) {
      try {
        await axiosInstance.delete(
          `/products/${id}`
        );

        toast.success(
          "Product deleted"
        );

        fetchProducts();
      } catch (error) {
        toast.error(
          error.response?.data
            ?.message ||
            "Delete failed"
        );
      }
    }
  };

  const filteredProducts =
    products.filter((product) =>
      product.name
        .toLowerCase()
        .includes(search.toLowerCase())
    );

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden px-6 lg:px-10 py-12">
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-red-700/10 blur-[150px] rounded-full"></div>

      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-red-900/10 blur-[150px] rounded-full"></div>

      <div className="relative z-10 space-y-12">
        {/* HEADER */}
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
          className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-8"
        >
          {/* Left */}
          <div>
            <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 rounded-full px-6 py-3 mb-8">
              <Sparkles className="text-red-400 w-5 h-5" />

              <span className="uppercase tracking-[4px] text-sm">
                Luxury Product Control
              </span>
            </div>

            <h1 className="text-6xl md:text-7xl font-serif leading-none">
              Manage
              <br />

              <span className="text-red-500 italic">
                Products
              </span>
            </h1>

            <p className="text-white/50 mt-8 text-lg max-w-2xl">
              Organize premium collections,
              luxury fashion products, and
              high-end inventory management.
            </p>
          </div>

          {/* Add Product */}
          <motion.div
            whileHover={{
              scale: 1.03,
            }}
            whileTap={{
              scale: 0.95,
            }}
          >
            <Link
              to="/admin/product/create"
              className="bg-red-700 hover:bg-red-600 px-8 py-5 rounded-full text-lg font-semibold transition-all duration-500 shadow-[0_10px_60px_rgba(220,38,38,0.5)] flex items-center gap-3"
            >
              <Plus className="w-5 h-5" />

              Add Product
            </Link>
          </motion.div>
        </motion.div>

        {/* SEARCH + STATUS */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-8">
          {/* Search */}
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
              delay: 0.2,
            }}
            className="rounded-[35px] border border-white/10 bg-white/5 backdrop-blur-2xl p-6"
          >
            <div className="relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-red-400 w-5 h-5" />

              <input
                type="text"
                placeholder="Search luxury products..."
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
                className="w-full bg-black/20 border border-white/10 rounded-2xl py-5 pl-14 pr-5 outline-none focus:border-red-500 transition-all text-white placeholder:text-white/30"
              />
            </div>
          </motion.div>

          {/* Status */}
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
              delay: 0.3,
            }}
            className="rounded-[35px] border border-white/10 bg-white/5 backdrop-blur-2xl p-8"
          >
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-3xl bg-red-600/10 border border-red-500/20 flex items-center justify-center">
                <Crown className="w-8 h-8 text-red-400" />
              </div>

              <div>
                <p className="uppercase tracking-[3px] text-white/40 text-xs">
                  Total Products
                </p>

                <h2 className="text-4xl font-bold mt-2">
                  {products.length}
                </h2>
              </div>
            </div>
          </motion.div>
        </div>

        {/* PRODUCTS */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(
              (i) => (
                <div
                  key={i}
                  className="h-[420px] rounded-[35px] bg-white/5 animate-pulse"
                ></div>
              )
            )}
          </div>
        ) : filteredProducts.length === 0 ? (
          <motion.div
            initial={{
              opacity: 0,
              y: 80,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="rounded-[45px] border border-white/10 bg-white/5 backdrop-blur-2xl p-20 text-center"
          >
            <Boxes className="w-20 h-20 mx-auto text-red-400 mb-8" />

            <h2 className="text-5xl font-serif">
              No Products Found
            </h2>

            <p className="text-white/40 mt-5 text-lg">
              Start adding luxury products to
              your premium collection.
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredProducts.map(
              (product, index) => (
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
                    delay:
                      index * 0.08,
                  }}
                  whileHover={{
                    y: -10,
                  }}
                  key={product._id}
                  className="group rounded-[40px] overflow-hidden border border-white/10 bg-white/5 backdrop-blur-2xl shadow-[0_20px_80px_rgba(0,0,0,0.5)]"
                >
                  {/* Image */}
                  <div className="relative overflow-hidden h-[320px]">
                    <img
                      src={
                        product
                          .images?.[0] ||
                        "https://via.placeholder.com/500"
                      }
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2000ms]"
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>

                    {/* Price */}
                    <div className="absolute top-5 left-5 bg-black/40 backdrop-blur-xl border border-white/10 px-5 py-2 rounded-full">
                      <span className="text-red-400 font-bold">
                        $
                        {product.price}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-8 space-y-6">
                    <div>
                      <p className="uppercase tracking-[4px] text-white/40 text-xs">
                        {
                          product.category
                        }
                      </p>

                      <h2 className="text-3xl font-serif mt-3">
                        {product.name}
                      </h2>
                    </div>

                    {/* Stock */}
                    <div className="flex items-center justify-between">
                      <span className="text-white/40">
                        Stock
                      </span>

                      <span
                        className={`px-4 py-2 rounded-full text-sm ${
                          product.stock >
                          0
                            ? "bg-green-500/10 border border-green-500/20 text-green-400"
                            : "bg-red-500/10 border border-red-500/20 text-red-400"
                        }`}
                      >
                        {product.stock >
                        0
                          ? `${product.stock} Available`
                          : "Out of Stock"}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-4 pt-4">
                      {/* Edit */}
                      <Link
                        to={`/admin/product/${product._id}/edit`}
                        className="flex-1 bg-red-700 hover:bg-red-600 py-4 rounded-2xl flex items-center justify-center gap-3 transition-all duration-500"
                      >
                        <Pencil className="w-5 h-5" />

                        Edit
                      </Link>

                      {/* Delete */}
                      <button
                        onClick={() =>
                          deleteHandler(
                            product._id
                          )
                        }
                        className="w-16 h-16 rounded-2xl border border-white/10 bg-black/20 hover:bg-red-600 transition-all duration-500 flex items-center justify-center"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Bottom */}
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-white/30 text-sm">
                        Luxury Collection
                      </span>

                      <ChevronRight className="w-5 h-5 text-white/20 group-hover:text-red-400 group-hover:translate-x-2 transition-all duration-500" />
                    </div>
                  </div>
                </motion.div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductListPage;