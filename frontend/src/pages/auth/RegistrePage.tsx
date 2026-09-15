"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FiEye, FiEyeOff, FiArrowRight, FiMail, FiUser, FiCheck } from "react-icons/fi";
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

export default function RegistrePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const strength = getPasswordStrength(password);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setError("Please enter your full name."); return; }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) { setError("Please enter a valid email address."); return; }
    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }
    if (password !== confirm) { setError("Passwords do not match."); return; }
    if (!agreed) { setError("Please accept the terms to continue."); return; }
    setError("");
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSuccess(true);
      setTimeout(() => router.push("/login"), 1000);
    }, 900);
  };

  const confirmBorder =
    confirm && confirm !== password
      ? "border-[#D97575]"
      : confirm && confirm === password
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
          className="w-full max-w-115"
        >
          <div className="text-center mb-8">
            <h1 className="font-serif text-3xl sm:text-4xl text-[#2A2B2F] tracking-tight">
              Create your Job<span className="italic text-[#3F5D9E]">pulse</span> account.
            </h1>
            <p className="mt-2.5 text-sm text-[#6B6B72] leading-relaxed max-w-[40ch] mx-auto">
              Upload your resume once, then let us surface matching roles from LinkedIn, Indeed, Adzuna, and Remotive.
            </p>
          </div>

          <div className="rounded-[14px] border border-[#E5E1D8] bg-white p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-colors hover:border-[#D8D2C4]">
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>

              {/* Full name */}
              <div>
                <label htmlFor="reg-name" className="block font-mono text-xs text-[#2A2B2F] font-medium mb-1.5">
                  Full name
                </label>
                <div className="relative">
                  <input
                    id="reg-name"
                    type="text"
                    value={name}
                    onChange={(e) => { setName(e.target.value); if (error) setError(""); }}
                    placeholder="Jane Doe"
                    autoComplete="name"
                    className="w-full h-11 pl-3.5 pr-10 rounded-lg bg-[#FAF9F6] border border-[#E5E1D8] hover:border-[#D8D2C4] text-sm text-[#2A2B2F] placeholder:text-[#949499] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F5D9E] transition-colors"
                  />
                  <FiUser className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#949499] pointer-events-none" aria-hidden="true" />
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="reg-email" className="block font-mono text-xs text-[#2A2B2F] font-medium mb-1.5">
                  Email address
                </label>
                <div className="relative">
                  <input
                    id="reg-email"
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); if (error) setError(""); }}
                    placeholder="name@domain.com"
                    autoComplete="email"
                    className="w-full h-11 pl-3.5 pr-10 rounded-lg bg-[#FAF9F6] border border-[#E5E1D8] hover:border-[#D8D2C4] text-sm text-[#2A2B2F] placeholder:text-[#949499] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F5D9E] transition-colors"
                  />
                  <FiMail className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#949499] pointer-events-none" aria-hidden="true" />
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="reg-password" className="block font-mono text-xs text-[#2A2B2F] font-medium mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="reg-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); if (error) setError(""); }}
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
                          style={{ backgroundColor: i <= strength.score ? strength.color : "#E5E1D8" }}
                        />
                      ))}
                    </div>
                    <span className="font-mono text-[11px]" style={{ color: strength.color }}>
                      {strength.label}
                    </span>
                  </div>
                )}
              </div>

              {/* Confirm password */}
              <div>
                <label htmlFor="reg-confirm" className="block font-mono text-xs text-[#2A2B2F] font-medium mb-1.5">
                  Confirm password
                </label>
                <div className="relative">
                  <input
                    id="reg-confirm"
                    type={showConfirm ? "text" : "password"}
                    value={confirm}
                    onChange={(e) => { setConfirm(e.target.value); if (error) setError(""); }}
                    placeholder="Repeat your password"
                    autoComplete="new-password"
                    className={"w-full h-11 pl-3.5 pr-10 rounded-lg bg-[#FAF9F6] border text-sm text-[#2A2B2F] placeholder:text-[#949499] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F5D9E] transition-colors " + confirmBorder}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#949499] hover:text-[#2A2B2F] transition-colors cursor-pointer focus-visible:outline-none"
                    aria-label={showConfirm ? "Hide password" : "Show password"}
                  >
                    {showConfirm ? <FiEyeOff className="h-4 w-4" /> : <FiEye className="h-4 w-4" />}
                  </button>
                </div>

                {/* Inline match feedback */}
                {confirm && (
                  <motion.p
                    key={confirm !== password ? "no-match" : "match"}
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.18 }}
                    className="mt-1.5 font-mono text-[11px] flex items-center gap-1"
                    style={{ color: confirm !== password ? "#D97575" : "#4C9A78" }}
                    aria-live="polite"
                  >
                    {confirm !== password ? (
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


              {/* Terms */}
              <div className="pt-1">
                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => { setAgreed(e.target.checked); if (error) setError(""); }}
                    className="mt-0.5 h-4 w-4 rounded-sm border-[#E5E1D8] text-[#3F5D9E] focus:ring-[#3F5D9E] cursor-pointer shrink-0"
                  />
                  <span className="font-mono text-xs text-[#6B6B72] leading-relaxed">
                    {"I agree to the "}
                    <Link href="#" className="text-[#3F5D9E] hover:underline cursor-pointer">Terms of Service</Link>
                    {" and "}
                    <Link href="#" className="text-[#3F5D9E] hover:underline cursor-pointer">Privacy Policy</Link>
                    {"."}
                  </span>
                </label>
              </div>

              {error && (
                <div id="reg-error" role="alert" className="rounded-lg bg-[#FAF9F6] border border-[#D97575]/40 p-2.5 font-mono text-xs text-[#D97575]">
                  {error}
                </div>
              )}

              {success && (
                <div role="status" className="rounded-lg bg-[#E6F2EC] border border-[#4C9A78]/30 p-2.5 font-mono text-xs text-[#4C9A78] flex items-center gap-2">
                  <FiCheck className="h-4 w-4" />
                  <span>Account created. Redirecting to sign in...</span>
                </div>
              )}

              <Button
                type="submit"
                size="lg"
                disabled={isLoading || success}
                className="w-full h-11 justify-center gap-2 text-sm font-medium cursor-pointer shadow-none disabled:opacity-70 mt-2"
              >
                {isLoading ? (
                  <span>Creating account...</span>
                ) : success ? (
                  <span>Account created</span>
                ) : (
                  <>
                    <span>Create my account</span>
                    <FiArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-5 pt-4 border-t border-[#E5E1D8] text-center font-mono text-[11px] text-[#6B6B72]">
              {"Already have an account? "}
              <Link href="/login" className="text-[#3F5D9E] hover:underline cursor-pointer font-medium">
                Sign in here
              </Link>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-[#6B6B72]">
              {"Questions? "}
              <Link href="#" className="text-[#3F5D9E] font-medium hover:underline cursor-pointer">
                Get in touch
              </Link>
            </p>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}

export { RegistrePage };