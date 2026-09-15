import React from "react";
import LoginPage from "@/src/pages/auth/LoginPage";
import RegistrePage from "@/src/pages/auth/RegistrePage";
import ForgotPassword from "@/src/pages/auth/ForgotPassword";
import ResetPassword from "@/src/pages/auth/ResetPassword";

export const AUTH_ROUTES = {
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
} as const;

export { LoginPage, RegistrePage, ForgotPassword, ResetPassword };

export default function AuthRoutes() {
  return <LoginPage />;
}

