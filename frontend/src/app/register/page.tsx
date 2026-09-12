import RegistrePage from "@/src/pages/auth/RegistrePage";

export const metadata = {
  title: "Create account - JobMatch",
  description: "Sign up for a free JobMatch account. Upload your resume once and receive automatic notifications for matching roles.",
};

export default function RegisterRoute() {
  return <RegistrePage />;
}