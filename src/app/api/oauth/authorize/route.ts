import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth";

// Temporary in-memory code store (can also be backed by DB)
interface AuthCodeEntry {
  userId: string;
  clientId: string;
  redirectUri: string;
  scope: string;
  codeChallenge?: string;
  expiresAt: number;
}

export const authCodeStore = new Map<string, AuthCodeEntry>();

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const clientId = searchParams.get("client_id");
    const redirectUri = searchParams.get("redirect_uri");
    const scope = searchParams.get("scope") || "openid profile email";
    const state = searchParams.get("state") || "";
    const codeChallenge = searchParams.get("code_challenge") || "";

    if (!clientId || !redirectUri) {
      return NextResponse.json(
        { error: "Missing client_id or redirect_uri parameters." },
        { status: 400 }
      );
    }

    // Check user active session
    const session = await getSessionFromRequest(req);

    if (!session) {
      // Redirect to login page with return parameters
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("redirect", req.url);
      return NextResponse.redirect(loginUrl);
    }

    // Generate standard authorization code
    const authCode = `tv_code_${Math.random().toString(36).substring(2)}${Date.now()}`;
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 mins

    authCodeStore.set(authCode, {
      userId: session.id,
      clientId,
      redirectUri,
      scope,
      codeChallenge,
      expiresAt,
    });

    // Build callback URL
    const callbackUrl = new URL(redirectUri);
    callbackUrl.searchParams.set("code", authCode);
    if (state) callbackUrl.searchParams.set("state", state);

    return NextResponse.redirect(callbackUrl);
  } catch (err: any) {
    console.error("OAuth Authorize Error:", err);
    return NextResponse.json(
      { error: "Failed to process authorization request.", details: err.message },
      { status: 500 }
    );
  }
}
