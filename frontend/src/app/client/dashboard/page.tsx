import ClientDashboard from "@/src/pages/client/Dashboard";

export const metadata = {
  title: "Dashboard & Live Matches — JobPulse",
  description: "Monitor live verified job openings matching your profile across Indeed, LinkedIn, Remotive, and Adzuna.",
};

export default function ClientDashboardRoute() {
  return <ClientDashboard />;
}
