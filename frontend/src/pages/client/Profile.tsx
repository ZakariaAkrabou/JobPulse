"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiUser,
  FiLock,
  FiFileText,
  FiMail,
  FiPhone,
  FiMapPin,
  FiBriefcase,
  FiAward,
  FiCheck,
  FiEye,
  FiEyeOff,
  FiAlertCircle,
  FiUploadCloud,
  FiDownload,
  FiRefreshCw,
} from "react-icons/fi";
import Header from "@/src/components/layout/header";
import Footer from "@/src/components/layout/footer";
import { Button } from "@/src/components/ui/button";

type ActiveTab = "profile" | "security" | "resume";

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

export default function ClientProfile() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("profile");

  // Profile form state (pre-filled with realistic sample data)
  const [profileData, setProfileData] = useState({
    fullName: "Zakaria Akrabou",
    email: "zakaria.akrabou@example.com",
    phone: "+212 6 00 11 22 33",
    currentTitle: "Senior Backend Engineer",
    location: "Casablanca, Morocco",
    experienceYears: 5,
    summary:
      "Passionate backend developer with 5+ years of experience designing and scaling high-throughput REST & gRPC APIs, distributed database schemas, and microservice architectures in Node.js and TypeScript.",
  });

  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSuccessMsg, setProfileSuccessMsg] = useState<string | null>(null);

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordSuccessMsg, setPasswordSuccessMsg] = useState<string | null>(null);

  const newPwStrength = getPasswordStrength(passwordData.newPassword);

  // Resume state
  const [currentResume, setCurrentResume] = useState({
    fileName: "zakaria_akrabou_senior_backend_resume.pdf",
    size: "245 KB",
    uploadedDate: "Oct 21, 2026",
    skillsExtracted: ["Node.js", "TypeScript", "PostgreSQL", "Docker", "Redis", "Distributed Systems"],
  });
  const [resumeUploading, setResumeUploading] = useState(false);
  const [resumeSuccessMsg, setResumeSuccessMsg] = useState<string | null>(null);

  // Handle Profile Save
  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileSuccessMsg(null);

    setTimeout(() => {
      setProfileSaving(false);
      setProfileSuccessMsg("Profile information updated successfully.");
      setTimeout(() => setProfileSuccessMsg(null), 4000);
    }, 700);
  };

  // Handle Password Change
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccessMsg(null);

    if (!passwordData.currentPassword) {
      setPasswordError("Please enter your current password.");
      return;
    }
    if (passwordData.newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters long.");
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }
    if (passwordData.currentPassword === passwordData.newPassword) {
      setPasswordError("New password must be different from your current password.");
      return;
    }

    setPasswordSaving(true);
    setTimeout(() => {
      setPasswordSaving(false);
      setPasswordSuccessMsg("Password changed successfully! Next login requires new credentials.");
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setTimeout(() => setPasswordSuccessMsg(null), 5000);
    }, 800);
  };

  // Handle Resume replacement simulation
  const handleResumeReplace = () => {
    setResumeUploading(true);
    setResumeSuccessMsg(null);
    setTimeout(() => {
      setResumeUploading(false);
      setCurrentResume((prev) => ({
        ...prev,
        fileName: "zakaria_akrabou_updated_cv.pdf",
        uploadedDate: "Today",
      }));
      setResumeSuccessMsg("Resume replaced and re-parsed successfully.");
      setTimeout(() => setResumeSuccessMsg(null), 4000);
    }, 900);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF9F6] text-[#2A2B2F]">
      {/* Header with identical logo placement & client nav */}
      <Header />

      {/* Main Container */}
      <main className="flex-1 mx-auto w-full max-w-285 px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Page Top Heading */}
        <div className="pb-8 border-b border-[#E5E1D8]">
          <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#6B6B72] mb-2 select-none">
            <span>ACCOUNT MANAGEMENT</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#2A2B2F] tracking-tight">
            Profile &amp; Security Settings
          </h1>
          <p className="mt-1.5 text-sm text-[#6B6B72] max-w-[62ch] leading-relaxed">
            Manage your personal profile details, resume extraction data, and account security
            credentials.
          </p>
        </div>

        {/* 2-Column Layout: Sidebar Profile Summary & Main Settings Tabs */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mt-8">
          {/* Left Column (4 cols): User Card & Tab Navigation */}
          <div className="lg:col-span-4 space-y-6">
            {/* Identity Card */}
            <div className="rounded-[14px] border border-[#E5E1D8] bg-[#FFFFFF] p-6 shadow-[0_4px_20px_rgb(0,0,0,0.02)]">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-full bg-[#E7ECF7] border border-[#3F5D9E]/20 text-[#3F5D9E] font-serif text-xl font-bold flex items-center justify-center shrink-0 shadow-xs">
                  ZA
                </div>
                <div className="min-w-0">
                  <h2 className="text-base font-semibold text-[#2A2B2F] truncate">
                    {profileData.fullName}
                  </h2>
                  <p className="text-xs font-mono text-[#6B6B72] truncate">
                    {profileData.currentTitle}
                  </p>
                  <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-[#E6F2EC] text-[#4C9A78] border border-[#4C9A78]/25 font-medium">
                    <FiCheck className="w-2.5 h-2.5" />
                    Verified Candidate
                  </span>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-[#E5E1D8] space-y-2 text-xs font-mono text-[#6B6B72]">
                <div className="flex items-center gap-2">
                  <FiMapPin className="w-3.5 h-3.5 text-[#949499]" />
                  <span>{profileData.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiMail className="w-3.5 h-3.5 text-[#949499]" />
                  <span className="truncate">{profileData.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiPhone className="w-3.5 h-3.5 text-[#949499]" />
                  <span>{profileData.phone}</span>
                </div>
              </div>
            </div>

            {/* Section Tab Buttons */}
            <div className="rounded-[14px] border border-[#E5E1D8] bg-[#FFFFFF] p-2 shadow-[0_4px_20px_rgb(0,0,0,0.02)] space-y-1">
              <button
                type="button"
                onClick={() => setActiveTab("profile")}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-mono font-medium transition-colors cursor-pointer ${
                  activeTab === "profile"
                    ? "bg-[#E7ECF7] text-[#3F5D9E]"
                    : "text-[#6B6B72] hover:bg-[#FAF9F6] hover:text-[#2A2B2F]"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <FiUser className="w-4 h-4" />
                  <span>Personal &amp; Job Profile</span>
                </div>
                {activeTab === "profile" && <span className="h-1.5 w-1.5 rounded-full bg-[#3F5D9E]" />}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("security")}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-mono font-medium transition-colors cursor-pointer ${
                  activeTab === "security"
                    ? "bg-[#E7ECF7] text-[#3F5D9E]"
                    : "text-[#6B6B72] hover:bg-[#FAF9F6] hover:text-[#2A2B2F]"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <FiLock className="w-4 h-4" />
                  <span>Password &amp; Security</span>
                </div>
                {activeTab === "security" && <span className="h-1.5 w-1.5 rounded-full bg-[#3F5D9E]" />}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("resume")}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-mono font-medium transition-colors cursor-pointer ${
                  activeTab === "resume"
                    ? "bg-[#E7ECF7] text-[#3F5D9E]"
                    : "text-[#6B6B72] hover:bg-[#FAF9F6] hover:text-[#2A2B2F]"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <FiFileText className="w-4 h-4" />
                  <span>Resume &amp; Parsing</span>
                </div>
                {activeTab === "resume" && <span className="h-1.5 w-1.5 rounded-full bg-[#3F5D9E]" />}
              </button>
            </div>
          </div>

          {/* Right Column (8 cols): Tab Content Panels */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              {/* TAB 1: General Profile Information */}
              {activeTab === "profile" && (
                <motion.div
                  key="tab-profile"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="rounded-[14px] border border-[#E5E1D8] bg-[#FFFFFF] p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
                >
                  <div className="pb-5 mb-6 border-b border-[#E5E1D8]">
                    <h2 className="font-serif text-2xl text-[#2A2B2F] tracking-tight">
                      Personal &amp; Professional Profile
                    </h2>
                    <p className="mt-1 text-xs font-mono text-[#6B6B72]">
                      These details are used to verify candidate matches against recruiter
                      specifications.
                    </p>
                  </div>

                  {/* Feedback Message */}
                  <AnimatePresence>
                    {profileSuccessMsg && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-6 rounded-lg border border-[#4C9A78]/30 bg-[#E6F2EC] p-3 text-xs font-mono text-[#4C9A78] flex items-center gap-2"
                      >
                        <FiCheck className="w-4 h-4 shrink-0" />
                        <span>{profileSuccessMsg}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <form onSubmit={handleProfileSubmit} className="space-y-5">
                    {/* Full Name & Current Job Title (2 columns) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="fullName"
                          className="block font-mono text-xs text-[#2A2B2F] font-medium mb-1.5"
                        >
                          Full Name
                        </label>
                        <div className="relative">
                          <input
                            id="fullName"
                            type="text"
                            value={profileData.fullName}
                            onChange={(e) =>
                              setProfileData({ ...profileData, fullName: e.target.value })
                            }
                            className="w-full h-11 pl-3.5 pr-10 rounded-lg bg-[#FAF9F6] border border-[#E5E1D8] text-sm text-[#2A2B2F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F5D9E] focus:bg-white transition-colors hover:border-[#D8D2C4]"
                          />
                          <FiUser className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#949499] pointer-events-none" />
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="currentTitle"
                          className="block font-mono text-xs text-[#2A2B2F] font-medium mb-1.5"
                        >
                          Current Job Title
                        </label>
                        <div className="relative">
                          <input
                            id="currentTitle"
                            type="text"
                            value={profileData.currentTitle}
                            onChange={(e) =>
                              setProfileData({ ...profileData, currentTitle: e.target.value })
                            }
                            className="w-full h-11 pl-3.5 pr-10 rounded-lg bg-[#FAF9F6] border border-[#E5E1D8] text-sm text-[#2A2B2F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F5D9E] focus:bg-white transition-colors hover:border-[#D8D2C4]"
                          />
                          <FiBriefcase className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#949499] pointer-events-none" />
                        </div>
                      </div>
                    </div>

                    {/* Email (read-only with badge) & Phone */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label
                            htmlFor="email"
                            className="block font-mono text-xs text-[#2A2B2F] font-medium"
                          >
                            Account Email
                          </label>
                          <span className="font-mono text-[10px] text-[#4C9A78] bg-[#E6F2EC] px-1.5 py-0.5 rounded">
                            Verified
                          </span>
                        </div>
                        <div className="relative">
                          <input
                            id="email"
                            type="email"
                            disabled
                            value={profileData.email}
                            className="w-full h-11 pl-3.5 pr-10 rounded-lg bg-[#F2EFE9]/60 border border-[#E5E1D8] text-sm text-[#6B6B72] cursor-not-allowed select-none"
                          />
                          <FiMail className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#949499] pointer-events-none" />
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="phone"
                          className="block font-mono text-xs text-[#2A2B2F] font-medium mb-1.5"
                        >
                          Phone Number
                        </label>
                        <div className="relative">
                          <input
                            id="phone"
                            type="tel"
                            value={profileData.phone}
                            onChange={(e) =>
                              setProfileData({ ...profileData, phone: e.target.value })
                            }
                            className="w-full h-11 pl-3.5 pr-10 rounded-lg bg-[#FAF9F6] border border-[#E5E1D8] text-sm text-[#2A2B2F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F5D9E] focus:bg-white transition-colors hover:border-[#D8D2C4]"
                          />
                          <FiPhone className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#949499] pointer-events-none" />
                        </div>
                      </div>
                    </div>

                    {/* Location & Experience Years */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="location"
                          className="block font-mono text-xs text-[#2A2B2F] font-medium mb-1.5"
                        >
                          Location (City, Country)
                        </label>
                        <div className="relative">
                          <input
                            id="location"
                            type="text"
                            value={profileData.location}
                            onChange={(e) =>
                              setProfileData({ ...profileData, location: e.target.value })
                            }
                            className="w-full h-11 pl-3.5 pr-10 rounded-lg bg-[#FAF9F6] border border-[#E5E1D8] text-sm text-[#2A2B2F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F5D9E] focus:bg-white transition-colors hover:border-[#D8D2C4]"
                          />
                          <FiMapPin className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#949499] pointer-events-none" />
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="experienceYears"
                          className="block font-mono text-xs text-[#2A2B2F] font-medium mb-1.5"
                        >
                          Years of Experience
                        </label>
                        <div className="relative">
                          <input
                            id="experienceYears"
                            type="number"
                            min={0}
                            max={60}
                            value={profileData.experienceYears}
                            onChange={(e) =>
                              setProfileData({
                                ...profileData,
                                experienceYears: Number(e.target.value) || 0,
                              })
                            }
                            className="w-full h-11 pl-3.5 pr-10 rounded-lg bg-[#FAF9F6] border border-[#E5E1D8] text-sm font-mono text-[#2A2B2F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F5D9E] focus:bg-white transition-colors hover:border-[#D8D2C4]"
                          />
                          <FiAward className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#949499] pointer-events-none" />
                        </div>
                      </div>
                    </div>

                    {/* Professional Summary */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label
                          htmlFor="summary"
                          className="block font-mono text-xs text-[#2A2B2F] font-medium"
                        >
                          Professional Summary
                        </label>
                        <span className="font-mono text-[10px] text-[#949499]">
                          {profileData.summary.length} / 5,000 characters
                        </span>
                      </div>
                      <textarea
                        id="summary"
                        rows={4}
                        value={profileData.summary}
                        onChange={(e) =>
                          setProfileData({ ...profileData, summary: e.target.value })
                        }
                        className="w-full p-3.5 rounded-lg bg-[#FAF9F6] border border-[#E5E1D8] text-sm text-[#2A2B2F] leading-relaxed placeholder:text-[#949499] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F5D9E] focus:bg-white transition-colors hover:border-[#D8D2C4]"
                      />
                    </div>

                    {/* Submit Button */}
                    <div className="pt-3 border-t border-[#E5E1D8] flex justify-end">
                      <Button
                        type="submit"
                        disabled={profileSaving}
                        className="min-w-36 h-11 text-sm font-medium cursor-pointer shadow-sm"
                      >
                        {profileSaving ? (
                          <span className="flex items-center gap-2">
                            <FiRefreshCw className="w-4 h-4 animate-spin" />
                            Saving...
                          </span>
                        ) : (
                          <span>Save Changes</span>
                        )}
                      </Button>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* TAB 2: Change Password & Security */}
              {activeTab === "security" && (
                <motion.div
                  key="tab-security"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="rounded-[14px] border border-[#E5E1D8] bg-[#FFFFFF] p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
                >
                  <div className="pb-5 mb-6 border-b border-[#E5E1D8]">
                    <h2 className="font-serif text-2xl text-[#2A2B2F] tracking-tight">
                      Security &amp; Password
                    </h2>
                    <p className="mt-1 text-xs font-mono text-[#6B6B72]">
                      Ensure your account uses a strong, unique password to safeguard your matches
                      and notifications.
                    </p>
                  </div>

                  {/* Error & Success Messages */}
                  <AnimatePresence>
                    {passwordError && (
                      <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        className="mb-5 rounded-lg border border-[#D97575]/40 bg-[#FDF2F2] p-3 text-xs text-[#D97575] flex items-center gap-2"
                      >
                        <FiAlertCircle className="w-4 h-4 shrink-0" />
                        <span>{passwordError}</span>
                      </motion.div>
                    )}
                    {passwordSuccessMsg && (
                      <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        className="mb-5 rounded-lg border border-[#4C9A78]/30 bg-[#E6F2EC] p-3 text-xs font-mono text-[#4C9A78] flex items-center gap-2"
                      >
                        <FiCheck className="w-4 h-4 shrink-0" />
                        <span>{passwordSuccessMsg}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <form onSubmit={handlePasswordSubmit} className="space-y-5">
                    {/* Current Password */}
                    <div>
                      <label
                        htmlFor="currentPassword"
                        className="block font-mono text-xs text-[#2A2B2F] font-medium mb-1.5"
                      >
                        Current Password
                      </label>
                      <div className="relative">
                        <input
                          id="currentPassword"
                          type={showCurrentPw ? "text" : "password"}
                          value={passwordData.currentPassword}
                          onChange={(e) =>
                            setPasswordData({ ...passwordData, currentPassword: e.target.value })
                          }
                          placeholder="••••••••••••"
                          className="w-full h-11 pl-3.5 pr-10 rounded-lg bg-[#FAF9F6] border border-[#E5E1D8] text-sm text-[#2A2B2F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F5D9E] focus:bg-white transition-colors hover:border-[#D8D2C4]"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPw(!showCurrentPw)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#949499] hover:text-[#2A2B2F] cursor-pointer"
                        >
                          {showCurrentPw ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* New Password & Strength */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label
                          htmlFor="newPassword"
                          className="block font-mono text-xs text-[#2A2B2F] font-medium"
                        >
                          New Password
                        </label>
                        {newPwStrength.label && (
                          <span
                            className="font-mono text-xs font-medium"
                            style={{ color: newPwStrength.color }}
                          >
                            Strength: {newPwStrength.label}
                          </span>
                        )}
                      </div>
                      <div className="relative">
                        <input
                          id="newPassword"
                          type={showNewPw ? "text" : "password"}
                          value={passwordData.newPassword}
                          onChange={(e) =>
                            setPasswordData({ ...passwordData, newPassword: e.target.value })
                          }
                          placeholder="At least 8 characters"
                          className="w-full h-11 pl-3.5 pr-10 rounded-lg bg-[#FAF9F6] border border-[#E5E1D8] text-sm text-[#2A2B2F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F5D9E] focus:bg-white transition-colors hover:border-[#D8D2C4]"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPw(!showNewPw)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#949499] hover:text-[#2A2B2F] cursor-pointer"
                        >
                          {showNewPw ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                        </button>
                      </div>

                      {/* Visual Strength Track */}
                      {passwordData.newPassword && (
                        <div className="mt-2 grid grid-cols-4 gap-1.5">
                          {[1, 2, 3, 4].map((step) => (
                            <div
                              key={step}
                              className="h-1 rounded-full transition-colors"
                              style={{
                                backgroundColor:
                                  newPwStrength.score >= step
                                    ? newPwStrength.color
                                    : "#E5E1D8",
                              }}
                            />
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Confirm New Password */}
                    <div>
                      <label
                        htmlFor="confirmPassword"
                        className="block font-mono text-xs text-[#2A2B2F] font-medium mb-1.5"
                      >
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <input
                          id="confirmPassword"
                          type={showConfirmPw ? "text" : "password"}
                          value={passwordData.confirmPassword}
                          onChange={(e) =>
                            setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                          }
                          placeholder="Re-enter your new password"
                          className="w-full h-11 pl-3.5 pr-10 rounded-lg bg-[#FAF9F6] border border-[#E5E1D8] text-sm text-[#2A2B2F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F5D9E] focus:bg-white transition-colors hover:border-[#D8D2C4]"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPw(!showConfirmPw)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#949499] hover:text-[#2A2B2F] cursor-pointer"
                        >
                          {showConfirmPw ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Security Requirements Checklist Card */}
                    <div className="p-4 rounded-xl border border-[#E5E1D8] bg-[#FAF9F6] space-y-1.5 text-xs font-mono text-[#6B6B72]">
                      <span className="font-semibold text-[#2A2B2F] block mb-1">
                        Password Requirements:
                      </span>
                      <div className="flex items-center gap-2">
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            passwordData.newPassword.length >= 8 ? "bg-[#4C9A78]" : "bg-[#D8D2C4]"
                          }`}
                        />
                        <span>Minimum 8 characters</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            /[A-Z]/.test(passwordData.newPassword) ? "bg-[#4C9A78]" : "bg-[#D8D2C4]"
                          }`}
                        />
                        <span>At least one uppercase letter (A-Z)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            /[0-9]/.test(passwordData.newPassword) ? "bg-[#4C9A78]" : "bg-[#D8D2C4]"
                          }`}
                        />
                        <span>At least one numerical digit (0-9)</span>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-3 border-t border-[#E5E1D8] flex justify-end">
                      <Button
                        type="submit"
                        disabled={passwordSaving}
                        className="min-w-40 h-11 text-sm font-medium cursor-pointer shadow-sm"
                      >
                        {passwordSaving ? (
                          <span className="flex items-center gap-2">
                            <FiRefreshCw className="w-4 h-4 animate-spin" />
                            Updating...
                          </span>
                        ) : (
                          <span>Update Password</span>
                        )}
                      </Button>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* TAB 3: Resume & Parsing Details */}
              {activeTab === "resume" && (
                <motion.div
                  key="tab-resume"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="rounded-[14px] border border-[#E5E1D8] bg-[#FFFFFF] p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-6"
                >
                  <div className="pb-5 border-b border-[#E5E1D8]">
                    <h2 className="font-serif text-2xl text-[#2A2B2F] tracking-tight">
                      Active Resume &amp; Skills Extraction
                    </h2>
                    <p className="mt-1 text-xs font-mono text-[#6B6B72]">
                      Your parsed resume is semantically cross-referenced against live verified
                      job feeds every hour.
                    </p>
                  </div>

                  {/* Feedback Banner */}
                  <AnimatePresence>
                    {resumeSuccessMsg && (
                      <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        className="rounded-lg border border-[#4C9A78]/30 bg-[#E6F2EC] p-3 text-xs font-mono text-[#4C9A78] flex items-center gap-2"
                      >
                        <FiCheck className="w-4 h-4 shrink-0" />
                        <span>{resumeSuccessMsg}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Active Resume Card */}
                  <div className="rounded-xl border border-[#E5E1D8] bg-[#FAF9F6] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className="h-12 w-12 rounded-xl bg-[#E7ECF7] text-[#3F5D9E] flex items-center justify-center shrink-0">
                        <FiFileText className="h-6 w-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-[#2A2B2F]">
                            {currentResume.fileName}
                          </p>
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#E6F2EC] text-[#4C9A78] font-medium border border-[#4C9A78]/25">
                            Active
                          </span>
                        </div>
                        <p className="text-xs font-mono text-[#949499] mt-0.5">
                          {currentResume.size} &bull; Uploaded {currentResume.uploadedDate}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleResumeReplace}
                        disabled={resumeUploading}
                        className="px-3.5 py-2 rounded-lg text-xs font-mono bg-[#FFFFFF] border border-[#E5E1D8] text-[#2A2B2F] hover:bg-[#F2EFE9] hover:border-[#D8D2C4] transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                      >
                        <FiUploadCloud className="w-3.5 h-3.5 text-[#3F5D9E]" />
                        <span>{resumeUploading ? "Uploading..." : "Replace CV"}</span>
                      </button>

                      <a
                        href="#"
                        onClick={(e) => e.preventDefault()}
                        className="p-2 rounded-lg text-xs font-mono bg-[#FFFFFF] border border-[#E5E1D8] text-[#6B6B72] hover:text-[#2A2B2F] hover:bg-[#F2EFE9] transition-colors"
                        title="Download current file"
                      >
                        <FiDownload className="w-4 h-4" />
                      </a>
                    </div>
                  </div>

                  {/* Extracted Skills Cloud */}
                  <div>
                    <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-[#6B6B72] mb-3">
                      Parsed Skills for Semantic Matching
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {currentResume.skillsExtracted.map((skill) => (
                        <span
                          key={skill}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-mono bg-[#FFFFFF] border border-[#E5E1D8] text-[#2A2B2F]"
                        >
                          <FiCheck className="w-3 h-3 text-[#4C9A78]" />
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export { ClientProfile };
