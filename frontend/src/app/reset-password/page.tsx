import ResetPassword from "@/src/pages/auth/ResetPassword";

export const metadata = {
  title: "Reset Password - JobMatch",
  description: "Set a new password for your JobMatch candidate account.",
};

export default function ResetPasswordRoute() {
  return <ResetPassword />;
}
