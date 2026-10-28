
import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/src/lib/server/api-client";
import {loginSchema} from "@/src/lib/validations/auth.schema"

export const runtime = "nodejs";



export async function POST(request: NextRequest) {
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return NextResponse.json(
      { success: false, message: "Content-Type must be application/json" },
      { status: 415 },
    );
  }

  const origin = request.headers.get("origin");

  if (origin && origin !== request.nextUrl.origin) {
    return NextResponse.json(
      { success: false, message: "Invalid request origin" },
      { status: 403 },
    );
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid JSON body" },
      { status: 400 },
    );
  }

  const parsed = loginSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        errors: parsed.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      },
      { status: 400 },
    );
  }

  try {
    const backendResponse = await backendFetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: parsed.data.email,
        password: parsed.data.password,
      }),
    });

    const data: unknown = await backendResponse.json().catch(() => null);

    if (!backendResponse.ok) {
      const result =
        typeof data === "object" && data !== null
          ? (data as {
              message?: unknown;
              errors?: unknown;
            })
          : {};

      return NextResponse.json(
        {
          success: false,
          ...(typeof result.message === "string"
            ? { message: result.message }
            : {}),
          ...(Array.isArray(result.errors)
            ? { errors: result.errors }
            : {}),
        },
        { status: backendResponse.status },
      );
    }

   
    const response = NextResponse.json({
      success: true,
      message: "Login successful",
    });

    
    const setCookie = backendResponse.headers.getSetCookie();

    if (setCookie.length === 0) {
    
      return NextResponse.json(
        {
          success: false,
          message: "Login service did not establish a session.",
        },
        { status: 502 },
      );
    }

    for (const cookie of setCookie) {
      response.headers.append("Set-Cookie", cookie);
    }

    return response;
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Unable to reach the login service. Please try again.",
      },
      { status: 502 },
    );
  }
}
