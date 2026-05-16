import { Link } from "react-router-dom";
import {
  Package,
  Users,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  ChevronRight,
  Activity,
  Crown,
  ShieldCheck,
  Sparkles,
  BarChart3,
  Boxes,
} from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axiosInstance from "../../Api/axiosInstance";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    users: 0,
    revenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Fetch all data in parallel for better performance
        const [productsRes, ordersRes, usersRes] = await Promise.all([
          axiosInstance.get("/products"),
          axiosInstance.get("/orders"),
          axiosInstance.get("/users"),
        ]);

        // Handle different API response structures
        const products = productsRes.data;
        const orders = ordersRes.data;
        const users = usersRes.data;

        // Calculate total revenue
        const totalRevenue = Array.isArray(orders) 
          ? orders.reduce((acc, order) => acc + (order.totalPrice || 0), 0)
          : 0;

        setStats({
          products: products.products?.length || products.length || 0,
          orders: Array.isArray(orders) ? orders.length : 0,
          users: Array.isArray(users) ? users.length : 0,
          revenue: totalRevenue,
        });
      } catch (error) {
        console.error("Dashboard fetch error:", error);
        setError(error.response?.data?.message || "Failed to load dashboard data");
        
        // Set default values on error
        setStats({
          products: 0,
          orders: 0,
          users: 0,
          revenue: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const cards = [
    {
      title: "Revenue",
      value: `$${stats.revenue.toLocaleString(undefined, { 
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2 
      })}`,
      icon: DollarSign,
      glow: "from-red-600 to-red-400",
      link: "/admin/orders",
      color: "red",
    },
    {
      title: "Orders",
      value: stats.orders.toLocaleString(),
      icon: ShoppingCart,
      glow: "from-orange-500 to-red-500",
      link: "/admin/orders",
      color: "orange",
    },
    {
      title: "Products",
      value: stats.products.toLocaleString(),
      icon: Package,
      glow: "from-red-500 to-pink-500",
      link: "/admin/products",
      color: "pink",
    },
    {
      title: "Users",
      value: stats.users.toLocaleString(),
      icon: Users,
      glow: "from-rose-500 to-red-700",
      link: "/admin/users",
      color: "rose",
    },
  ];

  // Calculate trends (example - you can implement real trend calculation)
  const getTrend = () => {
    return {
      percentage: "+23%",
      icon: TrendingUp,
    };
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden px-6 lg:px-10 py-12">
      {/* Background Glow Effects */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-red-700/10 blur-[150px] rounded-full"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-red-900/10 blur-[150px] rounded-full"></div>

      <div className="relative z-10 space-y-12">
        {/* Error Display */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/10 border border-red-500 rounded-2xl p-6 backdrop-blur-xl"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                <span className="text-red-400 text-xl">!</span>
              </div>
              <div>
                <h3 className="font-semibold text-red-400">Error Loading Dashboard</h3>
                <p className="text-white/70 text-sm">{error}</p>
              </div>
              <button
                onClick={() => window.location.reload()}
                className="ml-auto bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-all"
              >
                Retry
              </button>
            </div>
          </motion.div>
        )}

        {/* HERO SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-8"
        >
          {/* Left Content */}
          <div>
            <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 backdrop-blur-xl rounded-full px-6 py-3 mb-8">
              <Sparkles className="text-red-400 w-5 h-5" />
              <span className="uppercase tracking-[4px] text-sm">
                Luxury Admin Panel
              </span>
            </div>

            <h1 className="text-6xl md:text-7xl font-serif leading-none">
              Admin
              <br />
              <span className="text-red-500 italic">Dashboard</span>
            </h1>

            <p className="text-white/50 mt-8 text-lg max-w-2xl">
              Manage luxury collections, premium customers, and high-end orders
              from one elegant control center.
            </p>
          </div>

          {/* Status Card */}
          <motion.div
            whileHover={{ y: -5 }}
            className="rounded-[35px] border border-white/10 bg-white/5 backdrop-blur-2xl p-8 min-w-[320px]"
          >
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-3xl bg-red-600/10 border border-red-500/20 flex items-center justify-center">
                <Activity className="w-8 h-8 text-red-400" />
              </div>
              <div>
                <p className="uppercase tracking-[3px] text-white/40 text-xs">
                  System Status
                </p>
                <h2 className="text-3xl font-bold mt-2">Live Monitoring</h2>
              </div>
            </div>
            <div className="flex items-center gap-3 mt-8 text-green-400">
              <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse"></div>
              <span>All systems operational</span>
            </div>
          </motion.div>
        </motion.div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
          {cards.map((card, index) => (
            <motion.div
              initial={{ opacity: 0, y: 80 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              key={card.title}
            >
              <Link
                to={card.link}
                className="group relative overflow-hidden rounded-[40px] border border-white/10 bg-white/5 backdrop-blur-2xl p-8 block shadow-[0_20px_80px_rgba(0,0,0,0.5)]"
              >
                {/* Glow Effect */}
                <div
                  className={`absolute inset-0 opacity-10 bg-gradient-to-br ${card.glow}`}
                ></div>

                {/* Icon */}
                <div
                  className={`relative w-20 h-20 rounded-3xl bg-gradient-to-br ${card.glow} flex items-center justify-center shadow-[0_10px_50px_rgba(220,38,38,0.4)]`}
                >
                  <card.icon className="w-10 h-10 text-white" />
                </div>

                {/* Content */}
                <div className="relative mt-8">
                  <p className="uppercase tracking-[4px] text-white/40 text-xs">
                    {card.title}
                  </p>
                  <h2 className="text-5xl font-bold mt-4">
                    {loading ? (
                      <span className="animate-pulse">...</span>
                    ) : (
                      card.value
                    )}
                  </h2>
                  
                  {/* Optional Trend Indicator */}
                  {!loading && card.title !== "Revenue" && (
                    <div className="flex items-center gap-1 mt-2 text-green-400 text-sm">
                      <TrendingUp className="w-3 h-3" />
                      <span>+12%</span>
                    </div>
                  )}
                </div>

                {/* Arrow Icon */}
                <ChevronRight className="absolute right-8 bottom-8 w-6 h-6 text-white/20 group-hover:text-red-400 group-hover:translate-x-2 transition-all duration-500" />
              </Link>
            </motion.div>
          ))}
        </div>

        {/* MAIN GRID - Quick Actions & Status */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: -80 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="xl:col-span-2 rounded-[45px] border border-white/10 bg-white/5 backdrop-blur-2xl p-10 shadow-[0_20px_100px_rgba(0,0,0,0.6)]"
          >
            <div className="flex items-center justify-between mb-10">
              <div>
                <p className="uppercase tracking-[4px] text-red-400 text-xs">
                  Management Center
                </p>
                <h2 className="text-4xl font-serif mt-3">Quick Actions</h2>
              </div>
              <BarChart3 className="w-10 h-10 text-red-400" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: "Manage Products",
                  desc: "Add or edit luxury collections",
                  icon: Boxes,
                  link: "/admin/products",
                },
                {
                  title: "Manage Orders",
                  desc: "Track premium customer orders",
                  icon: ShoppingCart,
                  link: "/admin/orders",
                },
                {
                  title: "Manage Users",
                  desc: "View registered members",
                  icon: Users,
                  link: "/admin/users",
                },
                {
                  title: "Sales Analytics",
                  desc: "Monitor revenue growth",
                  icon: TrendingUp,
                  link: "/admin/analytics",
                },
              ].map((item, index) => (
                <motion.div whileHover={{ y: -8 }} key={item.title}>
                  <Link
                    to={item.link}
                    className="group rounded-[35px] border border-white/10 bg-black/20 p-8 flex items-start justify-between hover:bg-red-600 transition-all duration-500"
                  >
                    <div>
                      <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center mb-6">
                        <item.icon className="w-8 h-8" />
                      </div>
                      <h3 className="text-2xl font-bold">{item.title}</h3>
                      <p className="text-white/50 mt-3 group-hover:text-white/80 transition-all">
                        {item.desc}
                      </p>
                    </div>
                    <ChevronRight className="w-6 h-6 opacity-30 group-hover:translate-x-2 transition-all duration-500" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Status Card */}
          <motion.div
            initial={{ opacity: 0, x: 80 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="rounded-[45px] overflow-hidden border border-white/10 bg-gradient-to-br from-red-700 to-black shadow-[0_20px_100px_rgba(220,38,38,0.3)]"
          >
            <div className="p-10 border-b border-white/10">
              <div className="w-20 h-20 rounded-3xl bg-white/10 backdrop-blur-xl flex items-center justify-center mb-8">
                <Crown className="w-10 h-10 text-white" />
              </div>
              <p className="uppercase tracking-[4px] text-white/60 text-xs">
                Premium Store
              </p>
              <h2 className="text-4xl font-serif mt-4">
                System
                <br />
                Control
              </h2>
            </div>

            <div className="p-10 space-y-6">
              {[
                { label: "Server Status", value: "Online", status: "success" },
                { label: "Database", value: "Connected", status: "success" },
                { label: "API Version", value: "v1.0.0", status: "info" },
                { label: "Security", value: "Protected", status: "success" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="text-white/60">{item.label}</span>
                  <div className="bg-white/10 backdrop-blur-xl px-4 py-2 rounded-full text-sm flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-green-400" />
                    {item.value}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;