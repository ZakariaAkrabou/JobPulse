import ResetPassword from "@/src/pages/auth/ResetPassword";

export const metadata = {
  title: "Reset Password - JobPulse",
  description: "Set a new password for your JobPulse candidate account.",
};

export default function ResetPasswordRoute() {
  return <ResetPassword />;
}
