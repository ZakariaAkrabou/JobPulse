import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/src/lib/server/api-client";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
     console.log("[NEXT API] Forgot password request received");
    console.log("[NEXT API] Email:", body.email);

    const response = await backendFetch("/api/auth/forgot-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      
    } );

    const data = await response.json();

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error("[Forgot Password API]", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to reach the authentication service.",
      },
      { status: 503 },
    );
  }
}
