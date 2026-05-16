    import { useState, useEffect } from "react";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import axiosInstance from "../../Api/axiosInstance";

import { useAuth } from "../../context/AuthContext";

import { toast } from "react-toastify";

import {
  KeyRound,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  RefreshCcw,
} from "lucide-react";

import { motion } from "framer-motion";

const VerifyOtpPage = () => {
  const [otp, setOtp] = useState([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);

  const [loading, setLoading] =
    useState(false);

  const [resendLoading, setResendLoading] =
    useState(false);

  const location = useLocation();

  const navigate = useNavigate();

  const { setUser } = useAuth();

  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      navigate("/register");
    }
  }, [email, navigate]);

  const handleChange = (
    element,
    index
  ) => {
    if (isNaN(element.value))
      return false;

    const newOtp = [...otp];

    newOtp[index] = element.value;

    setOtp(newOtp);

    // Focus next input
    if (
      element.nextSibling &&
      element.value
    ) {
      element.nextSibling.focus();
    }
  };

  const handleBackspace = (
    e,
    index
  ) => {
    if (
      e.key === "Backspace" &&
      !otp[index] &&
      e.target.previousSibling
    ) {
      e.target.previousSibling.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const otpCode = otp.join("");

    if (otpCode.length !== 6) {
      return toast.error(
        "Please enter complete OTP"
      );
    }

    setLoading(true);

    try {
      const { data } =
        await axiosInstance.post(
          "/auth/verify-otp",
          {
            email,
            otp: otpCode,
          }
        );

      toast.success(
        "Email verified successfully!"
      );

      setUser(data);

      navigate("/");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Verification failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setResendLoading(true);

    try {
      await axiosInstance.post(
        "/auth/register",
        {
          email,
        }
      );

      toast.success(
        "New OTP sent successfully!"
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to resend OTP"
      );
    } finally {
      setResendLoading(false);
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
        className="relative z-10 w-full max-w-2xl"
      >
        <div className="rounded-[45px] border border-white/10 bg-white/5 backdrop-blur-2xl p-10 md:p-16 shadow-[0_20px_120px_rgba(0,0,0,0.6)] text-center">
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
              Premium Verification
            </span>
          </motion.div>

          {/* Icon */}
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.5,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            transition={{
              delay: 0.3,
            }}
            className="w-28 h-28 rounded-full bg-red-600/10 border border-red-500/20 flex items-center justify-center mx-auto mb-10"
          >
            <KeyRound className="w-14 h-14 text-red-400" />
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
              delay: 0.4,
            }}
          >
            <h1 className="text-5xl md:text-6xl font-serif leading-tight">
              Verify
              <br />

              <span className="text-red-500 italic">
                Account
              </span>
            </h1>

            <p className="text-white/50 mt-6 text-lg leading-relaxed">
              We’ve sent a premium security
              verification code to
            </p>

            <p className="text-white font-semibold mt-3 text-lg break-all">
              {email}
            </p>
          </motion.div>

          {/* FORM */}
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
              delay: 0.5,
            }}
            onSubmit={handleSubmit}
            className="mt-14"
          >
            {/* OTP Inputs */}
            <div className="flex justify-center gap-3 md:gap-5">
              {otp.map((data, index) => (
                <motion.input
                  whileFocus={{
                    scale: 1.08,
                  }}
                  key={index}
                  type="text"
                  maxLength="1"
                  value={data}
                  onChange={(e) =>
                    handleChange(
                      e.target,
                      index
                    )
                  }
                  onKeyDown={(e) =>
                    handleBackspace(
                      e,
                      index
                    )
                  }
                  onFocus={(e) =>
                    e.target.select()
                  }
                  className="w-14 h-16 md:w-16 md:h-20 bg-black/30 border border-white/10 rounded-2xl text-center text-2xl md:text-3xl font-bold outline-none focus:border-red-500 transition-all text-white"
                />
              ))}
            </div>

            {/* Security Text */}
            <div className="flex items-center justify-center gap-3 text-white/40 text-sm mt-10">
              <ShieldCheck className="w-5 h-5 text-green-400" />

              End-to-end encrypted verification
            </div>

            {/* Verify Button */}
            <motion.button
              whileHover={{
                scale: 1.03,
              }}
              whileTap={{
                scale: 0.95,
              }}
              type="submit"
              disabled={loading}
              className="w-full bg-red-700 hover:bg-red-600 py-5 rounded-full text-lg font-semibold transition-all duration-500 shadow-[0_10px_60px_rgba(220,38,38,0.5)] disabled:opacity-50 flex items-center justify-center gap-3 mt-10"
            >
              {loading ? (
                "Verifying..."
              ) : (
                <>
                  Verify Account

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
              delay: 0.7,
            }}
            className="mt-10"
          >
            <p className="text-white/40">
              Didn’t receive the code?
            </p>

            <button
              onClick={handleResendOtp}
              disabled={resendLoading}
              className="inline-flex items-center gap-2 text-red-400 hover:text-white transition-all mt-4"
            >
              {resendLoading ? (
                "Sending..."
              ) : (
                <>
                  Resend OTP

                  <RefreshCcw className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="mt-8">
              <button
                onClick={() =>
                  navigate("/register")
                }
                className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-all"
              >
                Back To Register

                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyOtpPage;
    
    