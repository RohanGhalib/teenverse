import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const ADMIN_JWT_SECRET = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET || "teenverse-admin-secret-thatoneghalib-2026"
);

export const ADMIN_PASSWORD = "thatoneghalib";

export async function signAdminToken(): Promise<string> {
  return new SignJWT({ role: "admin", authenticatedAt: Date.now() })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(ADMIN_JWT_SECRET);
}

export async function verifyAdminToken(token: string): Promise<boolean> {
  try {
    const { payload } = await jwtVerify(token, ADMIN_JWT_SECRET);
    return payload.role === "admin";
  } catch (err) {
    return false;
  }
}

export async function isAdminAuthenticated(req?: NextRequest): Promise<boolean> {
  let token: string | undefined;

  if (req) {
    token = req.cookies.get("tv_admin_session")?.value;
    if (!token) {
      const authHeader = req.headers.get("authorization");
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.substring(7);
      }
    }
  } else {
    const cookieStore = await cookies();
    token = cookieStore.get("tv_admin_session")?.value;
  }

  if (!token) return false;
  return verifyAdminToken(token);
}

export function setAdminCookie(res: NextResponse, token: string) {
  res.cookies.set("tv_admin_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });
}

export function clearAdminCookie(res: NextResponse) {
  res.cookies.set("tv_admin_session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}
