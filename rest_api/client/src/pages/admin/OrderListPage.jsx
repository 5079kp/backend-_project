import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../../Api/axiosInstance";
import {
  ShoppingBag,
  PackageCheck,
  Truck,
  Clock,
  ChevronRight,
  Search,
  Sparkles,
  Crown,
  AlertCircle,
} from "lucide-react";
import { motion } from "framer-motion";

const OrderListPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const { data } = await axiosInstance.get("/orders");
        
        // Ensure data is an array
        const ordersArray = Array.isArray(data) ? data : [];
        
        // Sort orders by date (newest first)
        const sortedOrders = ordersArray.sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        
        setOrders(sortedOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setError(error.response?.data?.message || "Failed to load orders. Please try again.");
        
        // Set empty array on error
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Safe search filter
  const filteredOrders = orders.filter((order) => {
    if (!search.trim()) return true;
    const orderId = order._id?.toLowerCase() || "";
    return orderId.includes(search.toLowerCase());
  });

  // Helper function for order status
  const getOrderStatus = (order) => {
    // Server schema uses isPaid/isDelivered/status string; this UI supports multiple possibilities safely.
    if (order.isDelivered) {
      return {
        text: "Delivered",
        icon: PackageCheck,
        className:
          "bg-green-500/10 border border-green-500/20 text-green-400",
      };
    }

    if (order.isShipped) {
      return {
        text: "Shipped",
        icon: Truck,
        className: "bg-blue-500/10 border border-blue-500/20 text-blue-400",
      };
    }

    if (order.isProcessing) {
      return {
        text: "Processing",
        icon: Clock,
        className: "bg-orange-500/10 border border-orange-500/20 text-orange-400",
      };
    }

    return {
      text: "Pending",
      icon: Clock,
      className: "bg-yellow-500/10 border border-yellow-500/20 text-yellow-400",
    };
  };

  // Format price safely
  const formatPrice = (price) => {
    if (!price && price !== 0) return "0.00";
    return Number(price).toFixed(2);
  };

  // Format date safely
  const formatDate = (dateString) => {
    if (!dateString) return "Date unavailable";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (e) {
      return "Invalid date";
    }
  };

  // Calculate summary stats
  const totalOrders = orders.length;
  const deliveredOrders = orders.filter(o => o.isDelivered).length;
  const pendingOrders = orders.filter(o => !o.isDelivered).length;


  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden px-6 lg:px-10 py-12">
      {/* Background Glow Effects */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-red-700/10 blur-[150px] rounded-full"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-red-900/10 blur-[150px] rounded-full"></div>

      <div className="relative z-10 space-y-12">
        {/* HEADER SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-8"
        >
          {/* Left Content */}
          <div>
            <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 rounded-full px-6 py-3 mb-8">
              <Sparkles className="text-red-400 w-5 h-5" />
              <span className="uppercase tracking-[4px] text-sm">
                Luxury Order Management
              </span>
            </div>

            <h1 className="text-6xl md:text-7xl font-serif leading-none">
              Manage
              <br />
              <span className="text-red-500 italic">Orders</span>
            </h1>

            <p className="text-white/50 mt-8 text-lg max-w-2xl">
              Track premium customer orders, deliveries, and luxury fashion
              purchases in real time.
            </p>
          </div>

          {/* Stats Card */}
          <motion.div
            whileHover={{ y: -5 }}
            className="rounded-[35px] border border-white/10 bg-white/5 backdrop-blur-2xl p-8 min-w-[320px]"
          >
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-3xl bg-red-600/10 border border-red-500/20 flex items-center justify-center">
                <Crown className="w-8 h-8 text-red-400" />
              </div>
              <div>
                <p className="uppercase tracking-[3px] text-white/40 text-xs">
                  Total Orders
                </p>
                <h2 className="text-4xl font-bold mt-2">{totalOrders}</h2>
                {totalOrders > 0 && (
                  <p className="text-white/40 text-sm mt-1">
                    {deliveredOrders} delivered • {pendingOrders} pending
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* ERROR DISPLAY */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[35px] border border-red-500/30 bg-red-500/10 backdrop-blur-2xl p-6"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-red-400">Error Loading Orders</h3>
                <p className="text-white/70 text-sm">{error}</p>
              </div>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all text-sm"
              >
                Retry
              </button>
            </div>
          </motion.div>
        )}

        {/* SEARCH BAR */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-[35px] border border-white/10 bg-white/5 backdrop-blur-2xl p-6"
        >
          <div className="relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-red-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by Order ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-black/20 border border-white/10 rounded-2xl py-5 pl-14 pr-5 outline-none focus:border-red-500 transition-all text-white placeholder:text-white/30"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>
        </motion.div>

        {/* ORDERS LIST */}
        {loading ? (
          // Loading Skeletons
          <div className="space-y-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-40 rounded-[35px] bg-white/5 animate-pulse"
              ></div>
            ))}
          </div>
        ) : filteredOrders.length === 0 ? (
          // Empty State
          <motion.div
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[45px] border border-white/10 bg-white/5 backdrop-blur-2xl p-20 text-center"
          >
            <ShoppingBag className="w-20 h-20 mx-auto text-red-400 mb-8" />
            <h2 className="text-5xl font-serif">
              {search ? "No Matching Orders" : "No Orders Found"}
            </h2>
            <p className="text-white/40 mt-5 text-lg">
              {search
                ? `No orders found matching "${search}"`
                : "Orders will appear here after customers make purchases."}
            </p>
            {search && (
              <button
                onClick={() => setSearch("")}
                className="mt-8 px-6 py-3 bg-red-600 hover:bg-red-700 rounded-full transition-all"
              >
                Clear Search
              </button>
            )}
          </motion.div>
        ) : (
          // Orders List
          <div className="space-y-6">
            {filteredOrders.map((order, index) => {
              const status = getOrderStatus(order);
              const StatusIcon = status.icon;
              
              return (
                <motion.div
                  initial={{ opacity: 0, y: 80 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -8 }}
                  key={order._id || index}
                >
                  <Link
                    to={`/order/${order._id}`}
                    className="group rounded-[40px] border border-white/10 bg-white/5 backdrop-blur-2xl p-8 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-8 shadow-[0_20px_80px_rgba(0,0,0,0.5)] block transition-all duration-300 hover:border-red-500/30"
                  >
                    {/* LEFT SECTION */}
                    <div className="flex items-center gap-6">
                      <div className="w-20 h-20 rounded-3xl bg-red-600/10 border border-red-500/20 flex items-center justify-center">
                        {order.isDelivered ? (
                          <PackageCheck className="w-10 h-10 text-green-400" />
                        ) : (
                          <Truck className="w-10 h-10 text-red-400" />
                        )}
                      </div>

                      <div>
                        <p className="uppercase tracking-[4px] text-white/40 text-xs">
                          Order ID
                        </p>
                        <h2 className="text-2xl font-bold mt-3">
                          #{order._id?.slice(-8) || "Unknown"}
                        </h2>
                        <p className="text-white/40 mt-3">
                          {order.user?.name || "Guest User"}
                        </p>
                      </div>
                    </div>

                    {/* CENTER SECTION */}
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
                      {/* Price */}
                      <div>
                        <p className="text-white/40 text-sm">Total</p>
                        <h3 className="text-4xl font-bold text-red-500 mt-2">
                          ${formatPrice(order.totalPrice)}
                        </h3>
                        {order.itemsCount && (
                          <p className="text-white/40 text-xs mt-1">
                            {order.itemsCount} items
                          </p>
                        )}
                      </div>

                      {/* Date */}
                      <div>
                        <p className="text-white/40 text-sm">Ordered On</p>
                        <h3 className="text-lg font-semibold mt-2">
                          {formatDate(order.createdAt)}
                        </h3>
                      </div>

                      {/* Status Badge */}
                      <div
                        className={`px-6 py-3 rounded-full text-sm uppercase tracking-[3px] flex items-center gap-3 ${status.className}`}
                      >
                        <StatusIcon className="w-4 h-4" />
                        {status.text}
                      </div>
                    </div>

                    {/* Arrow Icon */}
                    <ChevronRight className="w-7 h-7 text-white/20 group-hover:text-red-400 group-hover:translate-x-2 transition-all duration-500" />
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Optional: Summary Footer */}
        {!loading && orders.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-white/40 text-sm pt-8 border-t border-white/10"
          >
            Showing {filteredOrders.length} of {orders.length} orders
            {filteredOrders.length !== orders.length && " (filtered)"}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default OrderListPage;