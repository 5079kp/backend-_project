import { useState } from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import axiosInstance from "../../Api/axiosInstance";

import { toast } from "react-toastify";

import {
  User,
  Mail,
  Lock,
  UserPlus,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Eye,
  EyeOff,
  Crown,
} from "lucide-react";

import { motion } from "framer-motion";

const RegisterPage = () => {
  const [formData, setFormData] =
    useState({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });

  const [showPassword, setShowPassword] =
    useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [loading, setLoading] =
    useState(false);

  const navigate = useNavigate();

  const {
    name,
    email,
    password,
    confirmPassword,
  } = formData;

  const onChange = (e) =>
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      password !== confirmPassword
    ) {
      return toast.error(
        "Passwords do not match"
      );
    }

    setLoading(true);

    try {
      await axiosInstance.post(
        "/auth/register",
        {
          name,
          email,
          password,
        }
      );

      toast.success(
        "OTP sent to your email!"
      );

      navigate("/verify-otp", {
        state: { email },
      });
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Registration failed"
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
            src="https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=1400&auto=format&fit=crop"
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
                  Premium Fashion Club
                </span>
              </div>

              <h1 className="text-6xl font-serif leading-none">
                Create
                <br />

                <span className="text-red-500 italic">
                  Account
                </span>
              </h1>

              <p className="text-white/60 mt-8 text-lg leading-relaxed max-w-md">
                Join the luxury fashion
                experience and unlock
                exclusive premium collections.
              </p>

              {/* Luxury Badge */}
              <div className="mt-10 inline-flex items-center gap-3 bg-red-600/10 border border-red-500/20 rounded-full px-6 py-4">
                <Crown className="w-5 h-5 text-red-400" />

                <span className="uppercase tracking-[3px] text-sm">
                  VIP Member Access
                </span>
              </div>
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
              Secure Registration
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
              Join
              <br />

              <span className="text-red-500 italic">
                Veloura
              </span>
            </h2>

            <p className="text-white/50 mt-6 text-lg">
              Create your premium luxury
              fashion account today.
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
            className="mt-12 space-y-7"
          >
            {/* Name */}
            <div>
              <label className="block text-white/60 uppercase tracking-[3px] text-xs mb-4">
                Full Name
              </label>

              <div className="relative">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 text-red-400 w-5 h-5" />

                <input
                  name="name"
                  type="text"
                  required
                  placeholder="John Doe"
                  value={name}
                  onChange={onChange}
                  className="w-full bg-black/30 border border-white/10 rounded-2xl py-5 pl-14 pr-5 outline-none focus:border-red-500 transition-all text-white placeholder:text-white/30"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-white/60 uppercase tracking-[3px] text-xs mb-4">
                Email Address
              </label>

              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-red-400 w-5 h-5" />

                <input
                  name="email"
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={onChange}
                  className="w-full bg-black/30 border border-white/10 rounded-2xl py-5 pl-14 pr-5 outline-none focus:border-red-500 transition-all text-white placeholder:text-white/30"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-white/60 uppercase tracking-[3px] text-xs mb-4">
                Password
              </label>

              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-red-400 w-5 h-5" />

                <input
                  name="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={onChange}
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

            {/* Confirm Password */}
            <div>
              <label className="block text-white/60 uppercase tracking-[3px] text-xs mb-4">
                Confirm Password
              </label>

              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-red-400 w-5 h-5" />

                <input
                  name="confirmPassword"
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={onChange}
                  className="w-full bg-black/30 border border-white/10 rounded-2xl py-5 pl-14 pr-14 outline-none focus:border-red-500 transition-all text-white placeholder:text-white/30"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-all"
                >
                  {showConfirmPassword ? (
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
                "Creating Account..."
              ) : (
                <>
                  Create Account

                  <UserPlus className="w-5 h-5" />
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
              Already have an account?
            </p>

            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-red-400 hover:text-white transition-all mt-3"
            >
              Login Here

              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;