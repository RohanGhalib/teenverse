import { NextRequest, NextResponse } from "next/server";
import { ADMIN_PASSWORD, signAdminToken, setAdminCookie, isAdminAuthenticated } from "@/lib/adminAuth";

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json().catch(() => ({}));

    if (!password || password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: "Invalid admin password." },
        { status: 401 }
      );
    }

    const token = await signAdminToken();
    const response = NextResponse.json({
      success: true,
      message: "Admin authentication successful!",
      token,
    });

    setAdminCookie(response, token);
    return response;
  } catch (err: any) {
    console.error("Admin login error:", err);
    return NextResponse.json(
      { error: "Server error during admin authentication.", details: err.message },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const authenticated = await isAdminAuthenticated(req);
  return NextResponse.json({ authenticated });
}
