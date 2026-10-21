import { NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

let fallbackPreferences: any = null;

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    const cookieHeader = request.headers.get("cookie");

    const backendRes = await fetch(`${BACKEND_URL}/api/user/preferences/all`, {
      method: "GET",
      headers: {
        ...(authHeader ? { Authorization: authHeader } : {}),
        ...(cookieHeader ? { Cookie: cookieHeader } : {}),
      },
      cache: "no-store",
    });

    if (backendRes.ok) {
      const data = await backendRes.json();
      return NextResponse.json(data);
    }
  } catch (err) {
    // Backend offline fallback
  }

  return NextResponse.json({
    success: true,
    data: {
      preferences: fallbackPreferences,
    },
  });
}
