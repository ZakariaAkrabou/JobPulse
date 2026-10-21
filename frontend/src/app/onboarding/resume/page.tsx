import ResumeUpload from "@/src/components/onboarding/ResumeUpload";

export const metadata = {
  title: "Upload Resume — JobPulse",
  description: "Upload your resume in PDF or Word format to receive tailored job notifications.",
};

export default function ResumeStepPage() {
  return <ResumeUpload />;
}
