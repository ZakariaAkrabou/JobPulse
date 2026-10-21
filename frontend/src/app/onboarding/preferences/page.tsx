import PreferencesForm from "@/src/components/onboarding/PreferencesForm";

export const metadata = {
  title: "Job Preferences — JobPulse",
  description: "Configure your target job preferences to receive tailored job notifications.",
};

export default function PreferencesStepPage() {
  return <PreferencesForm />;
}
