import { redirect } from "next/navigation";

export default function OnboardingRootPage() {
  // Redirect to step 1: Profile form
  redirect("/onboarding/profile");
}
