import ForgotPassword from "@/src/pages/auth/ForgotPassword";

export const metadata = {
  title: "Forgot Password - JobMatch",
  description: "Reset your JobMatch candidate account password.",
};

export default function ForgotPasswordRoute() {
  return <ForgotPassword />;
}
