import { NextRequest, NextResponse } from "next/server";
import { authCodeStore } from "../authorize/route";
import { fetchFullUserProfile, signSessionToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    let body: any = {};
    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      body = await req.json();
    } else if (contentType.includes("application/x-www-form-urlencoded")) {
      const formData = await req.formData();
      body = Object.fromEntries(formData.entries());
    }

    const { grant_type, code, client_id } = body;

    if (grant_type !== "authorization_code" && grant_type !== "client_credentials") {
      return NextResponse.json(
        { error: "unsupported_grant_type", error_description: "Only authorization_code grant type is supported." },
        { status: 400 }
      );
    }

    if (!code) {
      return NextResponse.json(
        { error: "invalid_request", error_description: "Missing authorization code." },
        { status: 400 }
      );
    }

    const entry = authCodeStore.get(code);

    if (!entry || Date.now() > entry.expiresAt) {
      if (entry) authCodeStore.delete(code);
      return NextResponse.json(
        { error: "invalid_grant", error_description: "Authorization code is invalid or expired." },
        { status: 400 }
      );
    }

    // One-time code use
    authCodeStore.delete(code);

    // Fetch user profile
    const user = await fetchFullUserProfile(entry.userId);

    if (!user) {
      return NextResponse.json(
        { error: "invalid_grant", error_description: "Associated user profile not found." },
        { status: 404 }
      );
    }

    // Sign Access Token and ID Token
    const rolesArray = user.roles || (user.role ? [user.role] : ["teen_member"]);

    const accessToken = await signSessionToken({
      id: user.id,
      accountId: user.account_id,
      email: user.email,
      roles: rolesArray,
    });

    const idToken = await signSessionToken({
      id: user.id,
      accountId: user.account_id,
      email: user.email,
      roles: rolesArray,
    });

    return NextResponse.json({
      access_token: accessToken,
      token_type: "Bearer",
      expires_in: 30 * 24 * 60 * 60, // 30 days
      id_token: idToken,
      scope: entry.scope,
    });
  } catch (err: any) {
    console.error("OAuth Token Error:", err);
    return NextResponse.json(
      { error: "server_error", error_description: err.message },
      { status: 500 }
    );
  }
}
