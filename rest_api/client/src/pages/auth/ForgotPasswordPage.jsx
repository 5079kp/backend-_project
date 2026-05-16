import { useState } from "react";
import axiosInstance from "../../Api/axiosInstance";
import { toast } from "react-toastify";

import {
  Mail,
  ArrowRight,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { motion } from "framer-motion";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");

  const [loading, setLoading] =
    useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter email");

      return;
    }

    setLoading(true);

    try {
      await axiosInstance.post(
        "/auth/forgot-password",
        {
          email,
        }
      );

      toast.success(
        "Password reset link sent to your email"
      );

      setEmail("");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Something went wrong"
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
        className="absolute w-[250px] h-[250px] bg-red-600/10 rounded-full blur-[120px]"
      />

      {/* Main Card */}
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
        className="relative z-10 w-full max-w-2xl"
      >
        <div className="rounded-[45px] border border-white/10 bg-white/5 backdrop-blur-2xl p-10 md:p-16 shadow-[0_20px_100px_rgba(0,0,0,0.5)]">
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
            className="inline-flex items-center gap-3 bg-white/5 border border-white/10 rounded-full px-6 py-3 mb-10"
          >
            <Sparkles className="text-red-400 w-5 h-5" />

            <span className="uppercase tracking-[4px] text-sm">
              Luxury Security Access
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
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
            className="text-5xl md:text-6xl font-serif leading-tight"
          >
            Forgot
            <br />

            <span className="text-red-500 italic">
              Password
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{
              opacity: 0,
              y: 40,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.4,
            }}
            className="text-white/50 text-lg leading-relaxed mt-8 max-w-xl"
          >
            Enter your registered email and
            receive a secure password reset
            link for your premium account.
          </motion.p>

          {/* Form */}
          <motion.form
            initial={{
              opacity: 0,
              y: 40,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.5,
            }}
            onSubmit={handleSubmit}
            className="mt-14 space-y-8"
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
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  className="w-full bg-black/30 border border-white/10 rounded-2xl py-5 pl-14 pr-5 outline-none focus:border-red-500 transition-all text-white placeholder:text-white/30"
                />
              </div>
            </div>

            {/* Security Note */}
            <div className="flex items-center gap-3 text-white/40 text-sm">
              <ShieldCheck className="w-5 h-5 text-green-400" />

              Secure encrypted password recovery
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
                "Sending Reset Link..."
              ) : (
                <>
                  Send Reset Link

                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </motion.button>
          </motion.form>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;