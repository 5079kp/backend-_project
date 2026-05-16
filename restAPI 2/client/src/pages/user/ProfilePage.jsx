import { useState, useEffect } from "react";

import { useAuth } from "../../hooks/useAuth";

import axiosInstance from "../../Api/axiosInstance";

import { toast } from "react-toastify";

import {
  User,
  Mail,
  ShoppingBag,
  Settings,
  ChevronRight,
  Package,
  Clock,
  ShieldCheck,
  Crown,
  Sparkles,
} from "lucide-react";

import { motion } from "framer-motion";

const ProfilePage = () => {
  const { user, setUser } = useAuth();

  const [orders, setOrders] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [activeTab, setActiveTab] =
    useState("orders");

  const [name, setName] = useState(
    user?.name || ""
  );

  const [email, setEmail] = useState(
    user?.email || ""
  );

  const [password, setPassword] =
    useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } =
          await axiosInstance.get(
            "/orders/myorders"
          );

        setOrders(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const { data } =
        await axiosInstance.put(
          "/users/profile",
          {
            name,
            email,
            password,
          }
        );

      setUser(data);

      toast.success(
        "Profile updated successfully"
      );

      setPassword("");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Update failed"
      );
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden px-6 lg:px-10 py-32">
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-red-700/10 blur-[150px] rounded-full"></div>

      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-red-900/10 blur-[150px] rounded-full"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* HERO */}
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
          className="mb-20"
        >
          <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 backdrop-blur-xl rounded-full px-6 py-3 mb-8">
            <Sparkles className="text-red-400 w-5 h-5" />

            <span className="uppercase tracking-[4px] text-sm">
              Luxury Member Profile
            </span>
          </div>

          <h1 className="text-6xl md:text-8xl font-serif leading-none">
            Welcome
            <br />

            <span className="text-red-500 italic">
              {user?.name}
            </span>
          </h1>
        </motion.div>

        {/* MAIN LAYOUT */}
        <div className="grid grid-cols-1 xl:grid-cols-[350px_1fr] gap-12">
          {/* SIDEBAR */}
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
            {/* Profile Card */}
            <div className="rounded-[40px] border border-white/10 bg-white/5 backdrop-blur-2xl p-10 text-center shadow-[0_20px_80px_rgba(0,0,0,0.5)]">
              {/* Avatar */}
              <div className="relative w-36 h-36 mx-auto">
                <div className="absolute inset-0 bg-red-600 blur-[50px] opacity-40 rounded-full"></div>

                <div className="relative w-full h-full rounded-full border border-white/10 bg-black/40 flex items-center justify-center overflow-hidden">
                  <User className="w-16 h-16 text-red-400" />
                </div>
              </div>

              {/* Name */}
              <div className="mt-8">
                <h2 className="text-4xl font-serif">
                  {user?.name}
                </h2>

                <p className="text-white/40 mt-3">
                  {user?.email}
                </p>
              </div>

              {/* Badge */}
              <div className="mt-8 inline-flex items-center gap-2 bg-red-600/10 border border-red-500/20 rounded-full px-5 py-3">
                <Crown className="w-5 h-5 text-red-400" />

                <span className="uppercase tracking-[3px] text-sm">
                  Premium Member
                </span>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-5 mt-10">
                <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                  <h3 className="text-3xl font-bold text-red-500">
                    {orders.length}
                  </h3>

                  <p className="text-white/40 text-sm mt-2">
                    Orders
                  </p>
                </div>

                <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                  <h3 className="text-3xl font-bold text-green-400">
                    VIP
                  </h3>

                  <p className="text-white/40 text-sm mt-2">
                    Status
                  </p>
                </div>
              </div>
            </div>

            {/* Menu */}
            <div className="rounded-[40px] border border-white/10 bg-white/5 backdrop-blur-2xl p-6 shadow-[0_20px_80px_rgba(0,0,0,0.5)]">
              <div className="space-y-4">
                {[
                  {
                    id: "orders",
                    title: "My Orders",
                    icon: ShoppingBag,
                  },

                  {
                    id: "settings",
                    title:
                      "Account Settings",
                    icon: Settings,
                  },
                ].map((item) => (
                  <motion.button
                    whileHover={{
                      x: 5,
                    }}
                    key={item.id}
                    onClick={() =>
                      setActiveTab(
                        item.id
                      )
                    }
                    className={`w-full flex items-center justify-between rounded-3xl px-6 py-5 transition-all duration-500 ${
                      activeTab ===
                      item.id
                        ? "bg-red-600 text-white shadow-[0_10px_40px_rgba(220,38,38,0.5)]"
                        : "bg-black/20 border border-white/5 hover:bg-white hover:text-black"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <item.icon className="w-5 h-5" />

                      <span className="font-semibold">
                        {item.title}
                      </span>
                    </div>

                    <ChevronRight className="w-5 h-5" />
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* CONTENT */}
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
          >
            {activeTab === "orders" ? (
              <div className="space-y-10">
                {/* Heading */}
                <div>
                  <p className="uppercase tracking-[5px] text-red-400 text-sm">
                    Your Fashion Orders
                  </p>

                  <h2 className="text-5xl font-serif mt-4">
                    Order History
                  </h2>
                </div>

                {/* Orders */}
                {loading ? (
                  <div className="space-y-6">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="h-40 rounded-[35px] bg-white/5 animate-pulse"
                      ></div>
                    ))}
                  </div>
                ) : orders.length === 0 ? (
                  <div className="rounded-[40px] border border-white/10 bg-white/5 backdrop-blur-2xl p-20 text-center">
                    <Package className="w-20 h-20 mx-auto text-red-400 mb-8" />

                    <h3 className="text-4xl font-serif">
                      No Orders Yet
                    </h3>

                    <p className="text-white/40 mt-5 text-lg">
                      Your luxury fashion
                      orders will appear here.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {orders.map(
                      (order, index) => (
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
                              index * 0.1,
                          }}
                          whileHover={{
                            y: -8,
                          }}
                          key={order._id}
                          className="group rounded-[40px] border border-white/10 bg-white/5 backdrop-blur-2xl p-8 shadow-[0_20px_80px_rgba(0,0,0,0.5)]"
                        >
                          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
                            {/* Left */}
                            <div className="flex items-center gap-6">
                              <div className="w-20 h-20 rounded-3xl bg-red-600/10 border border-red-500/20 flex items-center justify-center">
                                <Clock className="w-9 h-9 text-red-400" />
                              </div>

                              <div>
                                <p className="uppercase tracking-[4px] text-white/40 text-xs">
                                  Order ID
                                </p>

                                <h3 className="text-2xl font-semibold mt-2">
                                  #
                                  {order._id.slice(
                                    -6
                                  )}
                                </h3>

                                <p className="text-white/40 mt-3">
                                  {new Date(
                                    order.createdAt
                                  ).toLocaleDateString()}
                                </p>
                              </div>
                            </div>

                            {/* Right */}
                            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8">
                              <div>
                                <p className="text-white/40 text-sm">
                                  Total
                                </p>

                                <h2 className="text-4xl font-bold text-red-500 mt-2">
                                  $
                                  {order.totalPrice.toFixed(
                                    2
                                  )}
                                </h2>
                              </div>

                              <div
                                className={`px-6 py-3 rounded-full text-sm uppercase tracking-[3px] ${
                                  order.isDelivered
                                    ? "bg-green-500/10 border border-green-500/20 text-green-400"
                                    : "bg-orange-500/10 border border-orange-500/20 text-orange-400"
                                }`}
                              >
                                {order.isDelivered
                                  ? "Delivered"
                                  : "Processing"}
                              </div>

                              <ChevronRight className="w-6 h-6 text-white/20 group-hover:text-red-400 transition-all duration-500" />
                            </div>
                          </div>
                        </motion.div>
                      )
                    )}
                  </div>
                )}
              </div>
            ) : (
              /* SETTINGS */
              <div className="space-y-10">
                {/* Heading */}
                <div>
                  <p className="uppercase tracking-[5px] text-red-400 text-sm">
                    Manage Account
                  </p>

                  <h2 className="text-5xl font-serif mt-4">
                    Account Settings
                  </h2>
                </div>

                {/* Form */}
                <form
                  onSubmit={handleUpdate}
                  className="rounded-[40px] border border-white/10 bg-white/5 backdrop-blur-2xl p-10 shadow-[0_20px_80px_rgba(0,0,0,0.5)] space-y-8"
                >
                  {/* Inputs */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Name */}
                    <div>
                      <label className="block text-white/60 uppercase tracking-[3px] text-xs mb-4">
                        Full Name
                      </label>

                      <div className="relative">
                        <User className="absolute left-5 top-5 text-red-400 w-5 h-5" />

                        <input
                          type="text"
                          value={name}
                          onChange={(e) =>
                            setName(
                              e.target.value
                            )
                          }
                          className="w-full bg-black/30 border border-white/10 rounded-2xl py-5 pl-14 pr-5 outline-none focus:border-red-500 transition-all"
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-white/60 uppercase tracking-[3px] text-xs mb-4">
                        Email Address
                      </label>

                      <div className="relative">
                        <Mail className="absolute left-5 top-5 text-red-400 w-5 h-5" />

                        <input
                          type="email"
                          value={email}
                          onChange={(e) =>
                            setEmail(
                              e.target.value
                            )
                          }
                          className="w-full bg-black/30 border border-white/10 rounded-2xl py-5 pl-14 pr-5 outline-none focus:border-red-500 transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-white/60 uppercase tracking-[3px] text-xs mb-4">
                      New Password
                    </label>

                    <div className="relative">
                      <ShieldCheck className="absolute left-5 top-5 text-red-400 w-5 h-5" />

                      <input
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) =>
                          setPassword(
                            e.target.value
                          )
                        }
                        className="w-full bg-black/30 border border-white/10 rounded-2xl py-5 pl-14 pr-5 outline-none focus:border-red-500 transition-all"
                      />
                    </div>
                  </div>

                  {/* Button */}
                  <motion.button
                    whileHover={{
                      scale: 1.03,
                    }}
                    whileTap={{
                      scale: 0.95,
                    }}
                    type="submit"
                    className="bg-red-700 hover:bg-red-600 px-10 py-5 rounded-full text-lg font-semibold transition-all duration-500 shadow-[0_10px_60px_rgba(220,38,38,0.5)]"
                  >
                    Save Changes
                  </motion.button>
                </form>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;