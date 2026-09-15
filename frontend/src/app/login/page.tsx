import LoginPage from "@/src/pages/auth/LoginPage";

export const metadata = {
  title: "Sign in - JobPulse",
  description: "Sign in to your JobPulse account to monitor matching roles and manage notifications.",
};

export default function LoginRoute() {
  return <LoginPage />;
}