import React from "react";
import LoginPage from "@/src/pages/auth/LoginPage";
import RegistrePage from "@/src/pages/auth/RegistrePage";

export const AUTH_ROUTES = {
  LOGIN: "/login",
  REGISTER: "/register",
} as const;

export { LoginPage, RegistrePage };

export default function AuthRoutes() {
  return <LoginPage />;
}
