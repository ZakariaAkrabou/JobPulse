"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiUploadCloud,
  FiFileText,
  FiCheck,
  FiX,
  FiArrowRight,
  FiAlertCircle,
  FiLoader,
} from "react-icons/fi";
import { Button } from "@/src/components/ui/button";
import ProgressBar from "./ProgressBar";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_EXTENSIONS = [".pdf", ".doc", ".docx"];
const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export default function ResumeUpload() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [existingResumeUrl, setExistingResumeUrl] = useState<string | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  // Check if user already has a resume on file
  useEffect(() => {
    let isMounted = true;

    async function checkExistingResume() {
      try {
        setIsLoadingProfile(true);
        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("token") || localStorage.getItem("access_token")
            : null;

        const res = await fetch("/profile", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          const profile = data?.data?.profile || data?.profile;
          if (isMounted && profile?.resumeUrl) {
            setExistingResumeUrl(profile.resumeUrl);
          }
        }
      } catch (err) {
        console.warn("Could not check existing resume:", err);
      } finally {
        if (isMounted) setIsLoadingProfile(false);
      }
    }

    checkExistingResume();
    return () => {
      isMounted = false;
    };
  }, []);

  const validateFile = (selectedFile: File): boolean => {
    setError(null);

    // Validate size
    if (selectedFile.size > MAX_FILE_SIZE) {
      setError("File size exceeds 5MB limit. Please upload a smaller file.");
      return false;
    }

    // Validate extension / MIME
    const extension = `.${selectedFile.name.split(".").pop()?.toLowerCase()}`;
    const isValidExtension = ALLOWED_EXTENSIONS.includes(extension);
    const isValidMime = ALLOWED_MIME_TYPES.includes(selectedFile.type);

    if (!isValidExtension && !isValidMime) {
      setError("Only PDF, DOC, and DOCX files are supported.");
      return false;
    }

    return true;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && validateFile(selectedFile)) {
      setFile(selectedFile);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile && validateFile(droppedFile)) {
      setFile(droppedFile);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // If already has resume and hasn't chosen a new file, simply advance
    if (!file && existingResumeUrl) {
      router.push("/onboarding/preferences");
      return;
    }

    if (!file) {
      setError("Please select a resume file or skip to the next step.");
      return;
    }

    try {
      setIsUploading(true);
      setError(null);

      const formData = new FormData();
      formData.append("resume", file);

      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("token") || localStorage.getItem("access_token")
          : null;

      const res = await fetch("/api/user/profile/resume", {
        method: "POST",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: "include",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to upload resume. Please try again.");
      }

      setIsSuccess(true);

      setTimeout(() => {
        router.push("/onboarding/preferences");
      }, 700);
    } catch (err: any) {
      console.error("Resume upload error:", err);
      setError(err?.message || "Failed to upload resume. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSkip = () => {
    router.push("/onboarding/preferences");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="w-full max-w-115 mx-auto"
    >
      {/* 3-segment progress indicator line */}
      <ProgressBar currentStep={2} totalSteps={3} />

      {/* Heading section */}
      <div className="text-center mb-8">
        <h1 className="font-serif text-3xl sm:text-4xl text-[#2A2B2F] tracking-tight">
          Upload your resume.
        </h1>
        <p className="mt-2.5 text-sm text-[#6B6B72] leading-relaxed max-w-[38ch] mx-auto">
          Upload your PDF or DOCX. We extract your skills and target experience to find high-match roles.
        </p>
      </div>

      {/* Main card */}
      <div className="rounded-[14px] border border-[#E5E1D8] bg-[#FFFFFF] p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-colors hover:border-[#D8D2C4]">
        {isLoadingProfile ? (
          <div className="space-y-4 py-8 animate-pulse text-center">
            <div className="h-28 w-full bg-[#FAF9F6] border border-dashed border-[#E5E1D8] rounded-xl" />
            <div className="h-11 w-full bg-[#F2EFE9] rounded-lg mt-4" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error banner */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="rounded-lg border border-[#D97575]/40 bg-[#FDF2F2] p-3 text-xs text-[#D97575] flex items-center gap-2"
                >
                  <FiAlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={handleFileChange}
              className="hidden"
              id="resume-file-input"
            />

            {/* File Dropzone or Selected File Preview */}
            {!file ? (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-8 sm:p-10 text-center transition-all cursor-pointer select-none ${
                  isDragging
                    ? "border-[#3F5D9E] bg-[#E7ECF7]/40 ring-4 ring-[#3F5D9E]/10"
                    : "border-[#E5E1D8] bg-[#FAF9F6] hover:bg-[#F2EFE9] hover:border-[#D8D2C4]"
                }`}
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#FFFFFF] border border-[#E5E1D8] text-[#3F5D9E] mb-3 shadow-xs">
                  <FiUploadCloud className="h-6 w-6" />
                </div>
                <p className="text-sm font-medium text-[#2A2B2F]">
                  <span className="text-[#3F5D9E] underline underline-offset-2">
                    Click to browse
                  </span>{" "}
                  or drag and drop your resume
                </p>
                <p className="font-mono text-xs text-[#949499] mt-1.5">
                  PDF, DOC, or DOCX (max 5MB)
                </p>

                {existingResumeUrl && (
                  <div className="mt-4 pt-3 border-t border-[#E5E1D8]/60 inline-flex items-center gap-1.5 text-xs font-mono text-[#4C9A78]">
                    <FiCheck className="w-3.5 h-3.5" />
                    <span>Resume already on file. Uploading replaces it.</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="rounded-xl border border-[#E5E1D8] bg-[#FAF9F6] p-4 flex items-center justify-between transition-colors">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#E7ECF7] text-[#3F5D9E]">
                    <FiFileText className="h-5 w-5" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-sm font-medium text-[#2A2B2F] truncate">
                      {file.name}
                    </p>
                    <p className="font-mono text-xs text-[#949499]">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleRemoveFile}
                  disabled={isUploading || isSuccess}
                  aria-label="Remove file"
                  className="p-1.5 rounded-md text-[#949499] hover:text-[#D97575] hover:bg-[#FFFFFF] border border-transparent hover:border-[#E5E1D8] transition-colors cursor-pointer"
                >
                  <FiX className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* Actions: Upload & Continue + Skip Link */}
            <div className="pt-2 space-y-3">
              <Button
                type="submit"
                disabled={isUploading || isSuccess || (!file && !existingResumeUrl)}
                className="w-full h-11 text-sm font-medium flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                {isUploading ? (
                  <>
                    <FiLoader className="w-4 h-4 animate-spin" />
                    <span>Uploading &amp; Parsing...</span>
                  </>
                ) : isSuccess ? (
                  <>
                    <FiCheck className="w-4 h-4 text-emerald-300" />
                    <span>Uploaded! Continuing...</span>
                  </>
                ) : (
                  <>
                    <span>{existingResumeUrl && !file ? "Continue" : "Upload & Continue"}</span>
                    <FiArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={handleSkip}
                  disabled={isUploading || isSuccess}
                  className="font-mono text-xs text-[#6B6B72] hover:text-[#2A2B2F] hover:underline underline-offset-4 transition-colors cursor-pointer disabled:opacity-50"
                >
                  I&apos;ll do this later &rarr;
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </motion.div>
  );
}

export { ResumeUpload };
