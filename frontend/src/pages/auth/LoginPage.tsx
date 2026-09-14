"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FiEye, FiEyeOff, FiArrowRight, FiMail, FiCheck } from "react-icons/fi";

import Header from "@/src/components/layout/header";
import Footer from "@/src/components/layout/footer";
import { Button } from "@/src/components/ui/button";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setError("Please enter your email address.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setError("Please enter a valid email format.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setError("");
    setIsLoading(true);

    // Simulate authentic authentication response
    setTimeout(() => {
      setIsLoading(false);
      setSuccess(true);
      setTimeout(() => {
        router.push("/");
      }, 900);
    }, 800);
  };

  const handleFillDemo = () => {
    setEmail("sarah.candidate@jobmatch.app");
    setPassword("calmhorizon2026");
    setError("");
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF9F6] text-[#2A2B2F]">
      <Header />

      <main className="flex-1 flex items-center justify-center py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="w-full max-w-110"
        >
          {/* Headline */}
          <div className="text-center mb-8">
            <h1 className="font-serif text-3xl sm:text-4xl text-[#2A2B2F] tracking-tight">
              Welcome back to Job<span className="italic text-[#3F5D9E]">match</span>.
            </h1>

            <p className="mt-2.5 text-sm text-[#6B6B72] leading-relaxed max-w-[38ch] mx-auto">
              Sign in to monitor your matching roles, adjust notification thresholds, and update your resume.
            </p>
          </div>

          
          <div className="rounded-[14px] border border-[#E5E1D8] bg-[#FFFFFF] p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-colors hover:border-[#D8D2C4]">
           
            <form onSubmit={handleSubmit} className="space-y-4">
          
              <div>
                <label
                  htmlFor="login-email"
                  className="block font-mono text-xs text-[#2A2B2F] font-medium mb-1.5"
                >
                  Work or personal email
                </label>
                <div className="relative">
                  <input
                    id="login-email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError("");
                    }}
                    placeholder="name@domain.com"
                    autoComplete="email"
                    aria-describedby={error ? "login-error" : undefined}
                    aria-invalid={Boolean(error)}
                    className={`w-full h-11 pl-3.5 pr-10 rounded-lg bg-[#FAF9F6] border text-sm text-[#2A2B2F] placeholder:text-[#949499] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F5D9E] transition-colors ${
                      error && !email ? "border-[#D97575]" : "border-[#E5E1D8] hover:border-[#D8D2C4]"
                    }`}
                  />
                  <FiMail
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#949499] pointer-events-none"
                    aria-hidden="true"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="login-password"
                    className="block font-mono text-xs text-[#2A2B2F] font-medium"
                  >
                    Password
                  </label>
                  <Link
                    href="#forgot"
                    onClick={(e) => {
                      e.preventDefault();
                      handleFillDemo();
                    }}
                    className="font-mono text-xs text-[#3F5D9E] hover:underline cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F5D9E] rounded-xs"
                  >
                    Forgot password?
                  </Link>
                </div>

                <div className="relative">
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (error) setError("");
                    }}
                    placeholder="••••••••••••"
                    autoComplete="current-password"
                    aria-describedby={error ? "login-error" : undefined}
                    aria-invalid={Boolean(error)}
                    className={`w-full h-11 pl-3.5 pr-10 rounded-lg bg-[#FAF9F6] border text-sm text-[#2A2B2F] placeholder:text-[#949499] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F5D9E] transition-colors ${
                      error && !password ? "border-[#D97575]" : "border-[#E5E1D8] hover:border-[#D8D2C4]"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#949499] hover:text-[#2A2B2F] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F5D9E] rounded-xs"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <FiEyeOff className="h-4 w-4" /> : <FiEye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded-sm border-[#E5E1D8] text-[#3F5D9E] focus:ring-[#3F5D9E] cursor-pointer"
                  />
                  <span className="font-mono text-xs text-[#6B6B72]">
                    Remember this device for 30 days
                  </span>
                </label>
              </div>

              {/* Error Message */}
              {error && (
                <div
                  id="login-error"
                  role="alert"
                  className="rounded-lg bg-[#FAF9F6] border border-[#D97575]/40 p-2.5 font-mono text-xs text-[#D97575]"
                >
                  {error}
                </div>
              )}

              {/* Success Message */}
              {success && (
                <div
                  role="status"
                  className="rounded-lg bg-[#E6F2EC] border border-[#4C9A78]/30 p-2.5 font-mono text-xs text-[#4C9A78] flex items-center gap-2"
                >
                  <FiCheck className="h-4 w-4" />
                  <span>Authenticated successfully. Redirecting to inbox…</span>
                </div>
              )}
              <Button
                type="submit"
                size="lg"
                disabled={isLoading || success}
                className="w-full h-11 justify-center gap-2 text-sm font-medium cursor-pointer shadow-none disabled:opacity-70 mt-2"
              >
                {isLoading ? (
                  <span>Signing in…</span>
                ) : success ? (
                  <span>Verified ✓</span>
                ) : (
                  <>
                    <span>Sign in to JobMatch</span>
                    <FiArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            
        
          </div>
          <div className="mt-6 text-center">
            <p className="text-sm text-[#6B6B72]">
              Don&apos;t have a candidate account yet?{" "}
              <Link
                href="/register"
                className="text-[#3F5D9E] font-medium hover:underline cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F5D9E] rounded-xs"
              >
                Start free here
              </Link>
            </p>
          </div>


        </motion.div>
      </main>

      <Footer />
    </div>
  );
}

export { LoginPage };
