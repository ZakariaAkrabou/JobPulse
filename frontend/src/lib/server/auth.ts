
import "server-only";

import { cookies } from "next/headers";
import { backendFetch } from "@/src/lib/server/api-client";

export type AuthenticatedUser = {
  id: string;
  email: string;
  fullName: string;
  role: string;
  isVerified: boolean;
};

type MeResponse = {
  success: boolean;
  user: AuthenticatedUser;
};

export async function getCurrentUser(): Promise<AuthenticatedUser | null> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  if (!accessToken) {
    return null;
  }

  const response = await backendFetch("/api/auth/me", {
    method: "GET",
    headers: {
      Cookie: `access_token=${accessToken}`,
    },
  });

  if (response.status === 401 || response.status === 403) {
    return null;
  }

  if (!response.ok) {
    throw new Error(
      `Failed to verify session: ${response.status}`,
    );
  }

  const data = (await response.json()) as MeResponse;

  if (!data.success || !data.user) {
    throw new Error("Invalid response from authentication endpoint");
  }

  return data.user;
}
