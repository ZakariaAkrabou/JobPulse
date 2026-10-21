import { NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Fallback in-memory state if backend is offline during frontend preview
let fallbackProfile: { currentTitle?: string; location?: string; fullName?: string } | null = null;

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    const cookieHeader = request.headers.get("cookie");

    const backendRes = await fetch(`${BACKEND_URL}/api/user/profile`, {
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
    // Fall back to stored state if backend is offline
  }

  return NextResponse.json({
    success: true,
    data: {
      profile: fallbackProfile,
    },
  });
}

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

    // Attempt to call the backend /api/user/profile endpoint
    const backendRes = await fetch(`${BACKEND_URL}/api/user/profile`, {
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
    // Backend offline; continue to save to fallback state
  }

  fallbackProfile = {
    ...fallbackProfile,
    currentTitle: body.currentTitle,
    location: body.location,
    ...(body.fullName ? { fullName: body.fullName } : {}),
  };

  return NextResponse.json({
    success: true,
    message: "Profile updated successfully",
    data: {
      profile: {
        id: "1",
        userId: "1",
        ...fallbackProfile,
      },
    },
  });
}
