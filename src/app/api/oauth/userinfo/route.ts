import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken, fetchFullUserProfile } from "@/lib/auth";

export async function GET(req: NextRequest) {
  return handleUserInfo(req);
}

export async function POST(req: NextRequest) {
  return handleUserInfo(req);
}

async function handleUserInfo(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "unauthorized", error_description: "Missing or invalid Bearer access token." },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const session = await verifySessionToken(token);

    if (!session) {
      return NextResponse.json(
        { error: "invalid_token", error_description: "Access token is invalid or expired." },
        { status: 401 }
      );
    }

    const userProfile = await fetchFullUserProfile(session.id);

    if (!userProfile) {
      return NextResponse.json({
        sub: session.id,
        account_id: session.accountId,
        email: session.email,
        roles: session.roles,
      });
    }

    return NextResponse.json({
      sub: userProfile.id,
      account_id: userProfile.account_id,
      email: userProfile.email,
      email_verified: userProfile.email_verified || true,
      first_name: userProfile.first_name,
      last_name: userProfile.last_name,
      father_name: userProfile.father_name,
      gender: userProfile.gender,
      city: userProfile.city,
      province: userProfile.province,
      education_level: userProfile.education_level,
      institute_name: userProfile.institute_name,
      is_verified_student: userProfile.is_verified_student || false,
      roles: userProfile.roles || [userProfile.role || "teen_member"],
      primary_domain: userProfile.primary_domain,
      avatar_url: userProfile.avatar_url || null,
      github_handle: userProfile.github_handle || null,
      discord_handle: userProfile.discord_handle || null,
    });
  } catch (err: any) {
    console.error("OAuth UserInfo Error:", err);
    return NextResponse.json(
      { error: "server_error", error_description: err.message },
      { status: 500 }
    );
  }
}
