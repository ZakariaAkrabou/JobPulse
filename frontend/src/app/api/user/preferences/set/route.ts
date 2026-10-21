import { NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

let fallbackPreferences: any = {
  jobType: "full_time",
  workMode: "onsite",
  dateRange: "d30",
  keywords: "backend developer",
  locationFilter: "Morocco",
  salaryMin: 8000,
  currency: "MAD",
};

export async function PUT(request: Request) {
  let body: any = {};
  try {
    const raw = await request.text();
    body = raw ? JSON.parse(raw) : {};
  } catch {
    body = {};
  }

  try {
    const authHeader = request.headers.get("authorization");
    const cookieHeader = request.headers.get("cookie");

    const backendRes = await fetch(`${BACKEND_URL}/api/user/preferences/set`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(authHeader ? { Authorization: authHeader } : {}),
        ...(cookieHeader ? { Cookie: cookieHeader } : {}),
      },
      body: JSON.stringify(body),
    });

    if (backendRes.ok) {
      const data = await backendRes.json();
      return NextResponse.json(data);
    }
  } catch (err) {
    // Backend offline fallback
  }

  fallbackPreferences = {
    ...fallbackPreferences,
    ...body,
  };

  return NextResponse.json({
    success: true,
    message: "Preferences updated",
    data: {
      preferences: {
        id: "1",
        userId: "1",
        ...fallbackPreferences,
      },
    },
  });
}
