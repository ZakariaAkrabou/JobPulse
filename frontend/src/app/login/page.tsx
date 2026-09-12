import LoginPage from "@/src/pages/auth/LoginPage";

export const metadata = {
  title: "Sign in - JobMatch",
  description: "Sign in to your JobMatch account to monitor matching roles and manage notifications.",
};

export default function LoginRoute() {
  return <LoginPage />;
}