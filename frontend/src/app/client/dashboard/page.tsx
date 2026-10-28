
import { redirect } from "next/navigation";

import ClientDashboard from "@/src/pages/client/Dashboard";
import { getCurrentUser } from "@/src/lib/server/auth";

export const metadata = {
  title: "Dashboard & Live Matches — JobPulse",
  description:
    "Monitor live verified job openings matching your profile across Indeed, LinkedIn, Remotive, and Adzuna.",
};

export default async function ClientDashboardRoute() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return <ClientDashboard />;
}
