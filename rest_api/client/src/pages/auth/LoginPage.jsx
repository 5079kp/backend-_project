import { useState } from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

import { toast } from "react-toastify";

import {
  Mail,
  Lock,
  LogIn,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Eye,
  EyeOff,
} from "lucide-react";

import { motion } from "framer-motion";

const LoginPage = () => {
  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const { login } = useAuth();

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      await login(email, password);

      toast.success("Welcome Back!");

      navigate("/");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden flex items-center justify-center px-6 py-20">
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-red-700/20 blur-[150px] rounded-full"></div>

      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-red-900/20 blur-[150px] rounded-full"></div>

      {/* Floating Glow */}
      <motion.div
        animate={{
          y: [0, -30, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 6,
        }}
        className="absolute w-[300px] h-[300px] bg-red-600/10 rounded-full blur-[120px]"
      ></motion.div>

      {/* Main Container */}
      <motion.div
        initial={{
          opacity: 0,
          scale: 0.8,
          y: 80,
        }}
        animate={{
          opacity: 1,
          scale: 1,
          y: 0,
        }}
        transition={{
          duration: 0.9,
          ease: "easeOut",
        }}
        className="relative z-10 w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 overflow-hidden rounded-[45px] border border-white/10 bg-white/5 backdrop-blur-2xl shadow-[0_20px_120px_rgba(0,0,0,0.6)]"
      >
        {/* LEFT SIDE */}
        <div className="hidden lg:flex relative overflow-hidden">
          {/* Image */}
          <img
            src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=1400&auto=format&fit=crop"
            alt="Fashion"
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>

          {/* Content */}
          <div className="relative z-10 flex flex-col justify-end p-14">
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
                delay: 0.5,
              }}
            >
              <div className="inline-flex items-center gap-3 bg-white/10 border border-white/10 backdrop-blur-xl rounded-full px-6 py-3 mb-8">
                <Sparkles className="text-red-400 w-5 h-5" />

                <span className="uppercase tracking-[4px] text-sm">
                  Luxury Fashion
                </span>
              </div>

              <h1 className="text-6xl font-serif leading-none">
                Welcome
                <br />

                <span className="text-red-500 italic">
                  Back
                </span>
              </h1>

              <p className="text-white/60 mt-8 text-lg leading-relaxed max-w-md">
                Access your premium fashion
                account and continue exploring
                luxury collections.
              </p>
            </motion.div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="p-10 md:p-16 flex flex-col justify-center">
          {/* Top Badge */}
          <motion.div
            initial={{
              opacity: 0,
              y: -20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.2,
            }}
            className="inline-flex items-center gap-3 bg-white/5 border border-white/10 rounded-full px-6 py-3 mb-10 w-fit"
          >
            <ShieldCheck className="text-green-400 w-5 h-5" />

            <span className="uppercase tracking-[4px] text-sm">
              Secure Login
            </span>
          </motion.div>

          {/* Heading */}
          <motion.div
            initial={{
              opacity: 0,
              y: 40,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.3,
            }}
          >
            <h2 className="text-5xl md:text-6xl font-serif leading-tight">
              Login To
              <br />

              <span className="text-red-500 italic">
                Veloura
              </span>
            </h2>

            <p className="text-white/50 mt-6 text-lg">
              Sign in to your luxury fashion
              account.
            </p>
          </motion.div>

          {/* Form */}
          <motion.form
            initial={{
              opacity: 0,
              y: 50,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.4,
            }}
            onSubmit={handleSubmit}
            className="mt-12 space-y-8"
          >
            {/* Email */}
            <div>
              <label className="block text-white/60 uppercase tracking-[3px] text-xs mb-4">
                Email Address
              </label>

              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-red-400 w-5 h-5" />

                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  className="w-full bg-black/30 border border-white/10 rounded-2xl py-5 pl-14 pr-5 outline-none focus:border-red-500 transition-all text-white placeholder:text-white/30"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="text-white/60 uppercase tracking-[3px] text-xs">
                  Password
                </label>

                <Link
                  to="/forgot-password"
                  className="text-red-400 hover:text-white transition-all text-sm"
                >
                  Forgot Password?
                </Link>
              </div>

              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-red-400 w-5 h-5" />

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) =>
                    setPassword(
                      e.target.value
                    )
                  }
                  className="w-full bg-black/30 border border-white/10 rounded-2xl py-5 pl-14 pr-14 outline-none focus:border-red-500 transition-all text-white placeholder:text-white/30"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-all"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
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
              disabled={loading}
              className="w-full bg-red-700 hover:bg-red-600 py-5 rounded-full text-lg font-semibold transition-all duration-500 shadow-[0_10px_60px_rgba(220,38,38,0.5)] disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {loading ? (
                "Logging In..."
              ) : (
                <>
                  Login Account

                  <LogIn className="w-5 h-5" />
                </>
              )}
            </motion.button>
          </motion.form>

          {/* Bottom */}
          <motion.div
            initial={{
              opacity: 0,
              y: 30,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.6,
            }}
            className="mt-10 text-center"
          >
            <p className="text-white/40">
              Don’t have an account?
            </p>

            <Link
              to="/register"
              className="inline-flex items-center gap-2 text-red-400 hover:text-white transition-all mt-3"
            >
              Create Premium Account

              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;