"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiMail, FiArrowRight, FiArrowLeft, FiCheck, FiRefreshCw } from "react-icons/fi";

import Header from "@/src/components/layout/header";
import Footer from "@/src/components/layout/footer";
import { Button } from "@/src/components/ui/button";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [resending, setResending] = useState(false);

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

    setError("");
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 850);
  };

  const handleResend = () => {
    setResending(true);
    setTimeout(() => {
      setResending(false);
    }, 800);
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
              Reset your Job<span className="italic text-[#3F5D9E]">pulse</span> password.
            </h1>

            <p className="mt-2.5 text-sm text-[#6B6B72] leading-relaxed max-w-[38ch] mx-auto">
              {isSubmitted
                ? "Check your inbox for instructions to securely reset your password."
                : "Enter the email associated with your candidate account, and we'll send you a recovery link."}
            </p>
          </div>

          <div className="rounded-[14px] border border-[#E5E1D8] bg-[#FFFFFF] p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-colors hover:border-[#D8D2C4]">
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <div>
                  <label
                    htmlFor="forgot-email"
                    className="block font-mono text-xs text-[#2A2B2F] font-medium mb-1.5"
                  >
                    Work or personal email
                  </label>
                  <div className="relative">
                    <input
                      id="forgot-email"
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (error) setError("");
                      }}
                      placeholder="name@domain.com"
                      autoComplete="email"
                      aria-describedby={error ? "forgot-error" : undefined}
                      aria-invalid={Boolean(error)}
                      className={`w-full h-11 pl-3.5 pr-10 rounded-lg bg-[#FAF9F6] border text-sm text-[#2A2B2F] placeholder:text-[#949499] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F5D9E] transition-colors ${
                        error ? "border-[#D97575]" : "border-[#E5E1D8] hover:border-[#D8D2C4]"
                      }`}
                    />
                    <FiMail
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#949499] pointer-events-none"
                      aria-hidden="true"
                    />
                  </div>
                </div>

             
                {error && (
                  <div
                    id="forgot-error"
                    role="alert"
                    className="rounded-lg bg-[#FAF9F6] border border-[#D97575]/40 p-2.5 font-mono text-xs text-[#D97575]"
                  >
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  size="lg"
                  disabled={isLoading}
                  className="w-full h-11 justify-center gap-2 text-sm font-medium cursor-pointer shadow-none disabled:opacity-70 mt-2"
                >
                  {isLoading ? (
                    <span>Sending link…</span>
                  ) : (
                    <>
                      <span>Send reset link</span>
                      <FiArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            ) : (
              <div className="space-y-5">
                <div
                  role="status"
                  className="rounded-lg bg-[#E6F2EC] border border-[#4C9A78]/30 p-3.5 font-mono text-xs text-[#4C9A78] flex items-start gap-2.5"
                >
                  <FiCheck className="h-4 w-4 mt-0.5 shrink-0" />
                  <div className="space-y-1">
                    <p className="font-semibold text-[#2A2B2F]">Reset email sent</p>
                    <p className="text-[#6B6B72] leading-relaxed">
                      We sent a password reset link to <span className="text-[#2A2B2F] font-medium">{email}</span>. Please check your inbox and spam folder.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleResend}
                    disabled={resending}
                    className="w-full sm:flex-1 h-10 gap-2 text-xs font-mono"
                  >
                    <FiRefreshCw className={`h-3.5 w-3.5 ${resending ? "animate-spin text-[#3F5D9E]" : ""}`} />
                    <span>{resending ? "Resending..." : "Resend email"}</span>
                  </Button>

                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      setIsSubmitted(false);
                      setEmail("");
                    }}
                    className="w-full sm:flex-1 h-10 text-xs font-mono"
                  >
                    Use different email
                  </Button>
                </div>
              </div>
            )}

            <div className="mt-6 pt-4 border-t border-[#E5E1D8] text-center font-mono text-xs">
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 text-[#3F5D9E] hover:underline cursor-pointer font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F5D9E] rounded-xs"
              >
                <FiArrowLeft className="h-3.5 w-3.5" />
                <span>Return to sign in</span>
              </Link>
            </div>
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

export { ForgotPassword };
