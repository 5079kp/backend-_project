import { useState } from "react";

import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import axiosInstance from "../../Api/axiosInstance";

import { toast } from "react-toastify";

import {
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

import { motion } from "framer-motion";

const ResetPasswordPage = () => {
  const [searchParams] =
    useSearchParams();

  const token =
    searchParams.get("token");

  const navigate = useNavigate();

  const [password, setPassword] =
    useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [loading, setLoading] =
    useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      password !== confirmPassword
    ) {
      return toast.error(
        "Passwords do not match"
      );
    }

    if (password.length < 6) {
      return toast.error(
        "Password must be at least 6 characters"
      );
    }

    setLoading(true);

    try {
      await axiosInstance.post(
        "/auth/reset-password",
        {
          token,
          password,
        }
      );

      toast.success(
        "Password reset successful!"
      );

      navigate("/login");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Reset failed"
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
        <div className="rounded-[45px] border border-white/10 bg-white/5 backdrop-blur-2xl p-10 md:p-16 shadow-[0_20px_120px_rgba(0,0,0,0.6)]">
          {/* Badge */}
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
              Luxury Security Reset
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
            <h1 className="text-5xl md:text-6xl font-serif leading-tight">
              Reset
              <br />

              <span className="text-red-500 italic">
                Password
              </span>
            </h1>

            <p className="text-white/50 mt-6 text-lg leading-relaxed">
              Create a new secure password for
              your premium fashion account.
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
            {/* Password */}
            <div>
              <label className="block text-white/60 uppercase tracking-[3px] text-xs mb-4">
                New Password
              </label>

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

            {/* Confirm Password */}
            <div>
              <label className="block text-white/60 uppercase tracking-[3px] text-xs mb-4">
                Confirm Password
              </label>

              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-red-400 w-5 h-5" />

                <input
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(
                      e.target.value
                    )
                  }
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

            {/* Security */}
            <div className="flex items-center gap-3 text-white/40 text-sm">
              <ShieldCheck className="w-5 h-5 text-green-400" />

              Secure encrypted password update
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
                "Updating Password..."
              ) : (
                <>
                  Reset Password

                  <CheckCircle2 className="w-5 h-5" />
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
            <button
              onClick={() =>
                navigate("/login")
              }
              className="inline-flex items-center gap-2 text-red-400 hover:text-white transition-all"
            >
              Back To Login

              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPasswordPage;