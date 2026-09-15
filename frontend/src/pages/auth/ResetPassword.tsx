"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FiEye, FiEyeOff, FiArrowRight, FiCheck } from "react-icons/fi";

import Header from "@/src/components/layout/header";
import Footer from "@/src/components/layout/footer";
import { Button } from "@/src/components/ui/button";

function getPasswordStrength(pw: string): { score: number; label: string; color: string } {
  if (!pw) return { score: 0, label: "", color: "" };
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const map: Record<number, { label: string; color: string }> = {
    1: { label: "Weak", color: "#D97575" },
    2: { label: "Fair", color: "#E8B894" },
    3: { label: "Good", color: "#4C9A78" },
    4: { label: "Strong", color: "#3F5D9E" },
  };
  return { score, ...(map[score] ?? { label: "", color: "" }) };
}

export default function ResetPassword() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const strength = getPasswordStrength(password);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!password) {
      setError("Please enter a new password.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (!confirmPassword) {
      setError("Please confirm your new password.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError("");
    setIsLoading(true);


    setTimeout(() => {
      setIsLoading(false);
      setSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 1000);
    }, 850);
  };

  const confirmBorder =
    confirmPassword && confirmPassword !== password
      ? "border-[#D97575]"
      : confirmPassword && confirmPassword === password
      ? "border-[#4C9A78]"
      : "border-[#E5E1D8] hover:border-[#D8D2C4]";

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
              Create new <span className="italic text-[#3F5D9E]">password</span>.
            </h1>

            <p className="mt-2.5 text-sm text-[#6B6B72] leading-relaxed max-w-[38ch] mx-auto">
              Your new password must be at least 8 characters and different from previously used passwords.
            </p>
          </div>

          <div className="rounded-[14px] border border-[#E5E1D8] bg-[#FFFFFF] p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-colors hover:border-[#D8D2C4]">
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {/* New Password */}
              <div>
                <label
                  htmlFor="reset-password"
                  className="block font-mono text-xs text-[#2A2B2F] font-medium mb-1.5"
                >
                  New password
                </label>
                <div className="relative">
                  <input
                    id="reset-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (error) setError("");
                    }}
                    placeholder="At least 8 characters"
                    autoComplete="new-password"
                    className="w-full h-11 pl-3.5 pr-10 rounded-lg bg-[#FAF9F6] border border-[#E5E1D8] hover:border-[#D8D2C4] text-sm text-[#2A2B2F] placeholder:text-[#949499] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F5D9E] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#949499] hover:text-[#2A2B2F] transition-colors cursor-pointer focus-visible:outline-none"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <FiEyeOff className="h-4 w-4" /> : <FiEye className="h-4 w-4" />}
                  </button>
                </div>

             
                {password && (
                  <div className="mt-2">
                    <div className="flex gap-1 mb-1">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className="h-1 flex-1 rounded-full transition-all duration-300"
                          style={{
                            backgroundColor: i <= strength.score ? strength.color : "#E5E1D8",
                          }}
                        />
                      ))}
                    </div>
                    <span className="font-mono text-[11px]" style={{ color: strength.color }}>
                      {strength.label}
                    </span>
                  </div>
                )}
              </div>

           
              <div>
                <label
                  htmlFor="reset-confirm"
                  className="block font-mono text-xs text-[#2A2B2F] font-medium mb-1.5"
                >
                  Confirm new password
                </label>
                <div className="relative">
                  <input
                    id="reset-confirm"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (error) setError("");
                    }}
                    placeholder="Repeat your new password"
                    autoComplete="new-password"
                    className={`w-full h-11 pl-3.5 pr-10 rounded-lg bg-[#FAF9F6] border text-sm text-[#2A2B2F] placeholder:text-[#949499] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F5D9E] transition-colors ${confirmBorder}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#949499] hover:text-[#2A2B2F] transition-colors cursor-pointer focus-visible:outline-none"
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? <FiEyeOff className="h-4 w-4" /> : <FiEye className="h-4 w-4" />}
                  </button>
                </div>

                
                {confirmPassword && (
                  <motion.p
                    key={confirmPassword !== password ? "no-match" : "match"}
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.18 }}
                    className="mt-1.5 font-mono text-[11px] flex items-center gap-1"
                    style={{ color: confirmPassword !== password ? "#D97575" : "#4C9A78" }}
                    aria-live="polite"
                  >
                    {confirmPassword !== password ? (
                      <>
                        <span aria-hidden="true">&#x2715;</span>
                        Passwords don&apos;t match
                      </>
                    ) : (
                      <>
                        <FiCheck className="h-3 w-3" />
                        Passwords match
                      </>
                    )}
                  </motion.p>
                )}
              </div>

            
              {error && (
                <div
                  id="reset-error"
                  role="alert"
                  className="rounded-lg bg-[#FAF9F6] border border-[#D97575]/40 p-2.5 font-mono text-xs text-[#D97575]"
                >
                  {error}
                </div>
              )}

             
              {success && (
                <div
                  role="status"
                  className="rounded-lg bg-[#E6F2EC] border border-[#4C9A78]/30 p-2.5 font-mono text-xs text-[#4C9A78] flex items-center gap-2"
                >
                  <FiCheck className="h-4 w-4" />
                  <span>Password updated successfully. Redirecting to login…</span>
                </div>
              )}

              <Button
                type="submit"
                size="lg"
                disabled={isLoading || success}
                className="w-full h-11 justify-center gap-2 text-sm font-medium cursor-pointer shadow-none disabled:opacity-70 mt-2"
              >
                {isLoading ? (
                  <span>Updating password…</span>
                ) : success ? (
                  <span>Password updated</span>
                ) : (
                  <>
                    <span>Reset password</span>
                    <FiArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-5 pt-4 border-t border-[#E5E1D8] text-center font-mono text-[11px] text-[#6B6B72]">
              {"Remember your password? "}
              <Link href="/login" className="text-[#3F5D9E] hover:underline cursor-pointer font-medium">
                Sign in here
              </Link>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-[#6B6B72]">
              {"Need assistance? "}
              <Link href="#" className="text-[#3F5D9E] font-medium hover:underline cursor-pointer">
                Contact candidate support
              </Link>
            </p>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}

export { ResetPassword };
