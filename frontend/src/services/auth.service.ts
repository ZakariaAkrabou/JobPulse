import type { RegisterInput, RegisterResponse, LoginInput, LoginResponse, ForgotPasswordPayload, ResetPasswordPayload, AuthResponse } from "@/src/types/auth";



export async function registerUser(input: RegisterInput,): Promise<RegisterResponse> {

  const response = await fetch("/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    credentials: "same-origin",
    cache: "no-store",
    body: JSON.stringify({
      fullName: input.fullName,
      email: input.email,
      password: input.password,
    }),
  });

  const data: unknown = await response.json().catch(() => null);

  if (
    typeof data !== "object" ||
    data === null ||
    !("success" in data)
  ) {
    throw new Error("Unexpected response from registration service");
  }

  const result = data as RegisterResponse;

  if (!response.ok && result.success) {
    throw new Error("Unexpected response from registration service");
  }

  return result;
}




export async function loginUser(input: LoginInput,): Promise<LoginResponse> {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    credentials: "same-origin",
    cache: "no-store",
    body: JSON.stringify({
      email: input.email.trim(),
      password: input.password,
    }),
  });

  const data: unknown = await response.json().catch(() => null);

  if (
    typeof data !== "object" ||
    data === null ||
    !("success" in data)
  ) {
    throw new Error("Unexpected response from login service");
  }

  const result = data as LoginResponse;

  if (!response.ok && result.success) {
    throw new Error("Unexpected response from login service");
  }

  return result;
}

export async function forgotPassword( payload: ForgotPasswordPayload): Promise<AuthResponse> {
  const response = await fetch("/api/auth/forgot-password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data: AuthResponse = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Unable to request password reset.");
  }

  return data;
}

export async function resetPassword(payload: ResetPasswordPayload ): Promise<AuthResponse> {

  const response = await fetch("/api/auth/reset-password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data: AuthResponse = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Unable to reset password.");
  }

  return data;
}