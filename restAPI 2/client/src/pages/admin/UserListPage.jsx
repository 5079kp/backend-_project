import { useEffect, useState } from "react";

import axiosInstance from "../../Api/axiosInstance";

import { toast } from "react-toastify";

import {
  Users,
  Search,
  Trash2,
  ShieldCheck,
  Crown,
  Sparkles,
  User2,
  Mail,
  ChevronRight,
  BadgeCheck,
} from "lucide-react";

import { motion } from "framer-motion";

const UserListPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchUsers = async () => {
    try {
      const { data } = await axiosInstance.get("/users");
      setUsers(data);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const deleteHandler = async (id) => {
    if (!window.confirm("Delete this user?")) return;

    try {
      await axiosInstance.delete(`/users/${id}`);
      toast.success("User deleted successfully");
      setLoading(true);
      await fetchUsers();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Delete failed"
      );
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(search.toLowerCase()) ||
      user.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden px-6 lg:px-10 py-12">
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-red-700/10 blur-[150px] rounded-full"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-red-900/10 blur-[150px] rounded-full"></div>

      <div className="relative z-10 space-y-12">
        {/* HERO */}
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-8"
        >
          {/* Left */}
          <div>
            <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 rounded-full px-6 py-3 mb-8">
              <Sparkles className="text-red-400 w-5 h-5" />
              <span className="uppercase tracking-[4px] text-sm">Luxury User Management</span>
            </div>

            <h1 className="text-6xl md:text-7xl font-serif leading-none">
              Manage
              <br />
              <span className="text-red-500 italic">Users</span>
            </h1>

            <p className="text-white/50 mt-8 text-lg max-w-2xl">
              Manage premium customers, luxury members, and platform access from your elegant admin system.
            </p>
          </div>

          {/* Status Card */}
          <motion.div
            whileHover={{ y: -5 }}
            className="rounded-[35px] border border-white/10 bg-white/5 backdrop-blur-2xl p-8 min-w-[320px]"
          >
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-3xl bg-red-600/10 border border-red-500/20 flex items-center justify-center">
                <Crown className="w-8 h-8 text-red-400" />
              </div>
              <div>
                <p className="uppercase tracking-[3px] text-white/40 text-xs">Total Members</p>
                <h2 className="text-4xl font-bold mt-2">{users.length}</h2>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* SEARCH */}
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
              placeholder="Search premium users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-black/20 border border-white/10 rounded-2xl py-5 pl-14 pr-5 outline-none focus:border-red-500 transition-all text-white placeholder:text-white/30"
            />
          </div>
        </motion.div>

        {/* USERS */}
        {loading ? (
          <div className="space-y-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-40 rounded-[35px] bg-white/5 animate-pulse"></div>
            ))}
          </div>
        ) : filteredUsers.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[45px] border border-white/10 bg-white/5 backdrop-blur-2xl p-20 text-center"
          >
            <Users className="w-20 h-20 mx-auto text-red-400 mb-8" />
            <h2 className="text-5xl font-serif">No Users Found</h2>
            <p className="text-white/40 mt-5 text-lg">Premium users will appear here after registration.</p>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {filteredUsers.map((user, index) => (
              <motion.div
                initial={{ opacity: 0, y: 80 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                whileHover={{ y: -8 }}
                key={user._id}
                className="group rounded-[40px] border border-white/10 bg-white/5 backdrop-blur-2xl p-8 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-8 shadow-[0_20px_80px_rgba(0,0,0,0.5)]"
              >
                {/* LEFT */}
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-red-700 to-black border border-white/10 flex items-center justify-center shadow-[0_10px_50px_rgba(220,38,38,0.3)]">
                    <User2 className="w-12 h-12 text-white" />
                  </div>

                  <div>
                    <div className="flex items-center gap-3">
                      <h2 className="text-3xl font-serif">{user.name}</h2>
                      {user.role === "admin" && (
                        <div className="px-4 py-2 rounded-full bg-red-600/10 border border-red-500/20 text-red-400 text-xs uppercase tracking-[3px] flex items-center gap-2">
                          <Crown className="w-4 h-4" />
                          Admin
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-white/40 mt-4">
                      <Mail className="w-5 h-5 text-red-400" />
                      <span>{user.email}</span>
                    </div>

                    <div className="flex items-center gap-3 text-green-400 mt-4 text-sm">
                      <BadgeCheck className="w-5 h-5" />
                      Verified Member
                    </div>
                  </div>
                </div>

                {/* RIGHT */}
                <div className="flex items-center gap-5">
                  <div
                    className={`px-6 py-4 rounded-2xl text-sm uppercase tracking-[3px] flex items-center gap-3 ${
                      user.role === "admin"
                        ? "bg-red-500/10 border border-red-500/20 text-red-400"
                        : "bg-green-500/10 border border-green-500/20 text-green-400"
                    }`}
                  >
                    <ShieldCheck className="w-5 h-5" />
                    {user.role}
                  </div>

                  {user.role !== "admin" && (
                    <motion.button
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => deleteHandler(user._id)}
                      className="w-16 h-16 rounded-2xl border border-white/10 bg-black/20 hover:bg-red-600 transition-all duration-500 flex items-center justify-center"
                    >
                      <Trash2 className="w-5 h-5" />
                    </motion.button>
                  )}

                  <ChevronRight className="w-7 h-7 text-white/20 group-hover:text-red-400 group-hover:translate-x-2 transition-all duration-500" />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserListPage;

