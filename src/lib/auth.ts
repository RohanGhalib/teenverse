import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "./supabase";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "teenverse-pakistan-central-identity-secret-2026"
);

export interface SessionPayload {
  id: string;
  accountId: string;
  email: string;
  roles: string[];
}

export async function signSessionToken(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d") // 30 days valid session
    .sign(JWT_SECRET);
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return {
      id: payload.id as string,
      accountId: payload.accountId as string,
      email: payload.email as string,
      roles: (payload.roles as string[]) || ["teen_member"],
    };
  } catch (err) {
    return null;
  }
}

export async function getSessionFromCookies(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("tv_session")?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export async function getSessionFromRequest(req: NextRequest): Promise<SessionPayload | null> {
  // Check cookie first
  const cookieToken = req.cookies.get("tv_session")?.value;
  if (cookieToken) {
    const session = await verifySessionToken(cookieToken);
    if (session) return session;
  }

  // Check Authorization header (Bearer <token>)
  const authHeader = req.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const bearerToken = authHeader.substring(7);
    return verifySessionToken(bearerToken);
  }

  return null;
}

export function setSessionCookie(res: NextResponse, token: string) {
  res.cookies.set("tv_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  });
}

export function clearSessionCookie(res: NextResponse) {
  res.cookies.set("tv_session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export async function fetchFullUserProfile(userId: string) {
  const { data, error } = await supabase
    .from("teenverse_users")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
  return data;
}
