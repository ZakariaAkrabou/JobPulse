import AdminDashboard from "@/src/pages/dashboard/page";

export const metadata = {
  title: 'Admin Dashboard - JobPulse',
  description: 'JobPulse admin dashboard overview',
};

export default function DashboardRoute() {
  return <AdminDashboard />;
}
