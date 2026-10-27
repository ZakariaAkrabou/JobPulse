import { NextRequest, NextResponse } from "next/server";
import { registerSchema } from "@/src/lib/validations/auth.schema"
import { backendFetch } from "@/src/lib/server/api-client";


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

  const parsed = registerSchema.safeParse(body);

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
    const backendResponse = await backendFetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({
        fullName: parsed.data.fullName,
        email: parsed.data.email,
        password: parsed.data.password,
      }),
    });

    let data: unknown;

    try {
      data = await backendResponse.json();
    } catch {
      data = null;
    }

    if (backendResponse.ok) {

      return NextResponse.json(
        {
          success: true,
          message:
            "Registration successful. Please check your email to verify your account.",
        },
        { status: backendResponse.status },
      );
    }

   
    if ([400, 409, 422, 429].includes(backendResponse.status)) {
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

    return NextResponse.json(
      {
        success: false,
        message: "Registration is temporarily unavailable. Please try again.",
      },
      { status: 502 },
    );
  } catch {
    
    return NextResponse.json(
      {
        success: false,
        message: "Unable to reach the registration service. Please try again.",
      },
      { status: 502 },
    );
  }
}
