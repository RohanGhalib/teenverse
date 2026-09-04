import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ authenticated: false, error: "Unauthorized" }, { status: 401 });
    }

    // 1. Fetch user record from teenverse_users
    const { data: userProfile, error: userErr } = await supabase
      .from("teenverse_users")
      .select("id, account_id, email, first_name, last_name, minecraft_username, minecraft_linked_at")
      .eq("id", session.id)
      .maybeSingle();

    if (userErr || !userProfile) {
      return NextResponse.json({ error: "User profile not found." }, { status: 404 });
    }

    const minecraftUsername = userProfile.minecraft_username || null;

    if (!minecraftUsername) {
      return NextResponse.json({
        authenticated: true,
        linked: false,
        minecraftUsername: null,
      });
    }

    // 2. Fetch AuthMe info if table exists
    let authMeData: any = null;
    try {
      const { data: authMeRecord } = await supabase
        .from("authme")
        .select("id, username, realname, email, lastlogin, isLogged")
        .eq("username", minecraftUsername.toLowerCase())
        .maybeSingle();

      authMeData = authMeRecord;
    } catch (e) {
      // Table might not be queried or permission restricted
    }

    return NextResponse.json({
      authenticated: true,
      linked: true,
      minecraftUsername: minecraftUsername,
      linkedAt: userProfile.minecraft_linked_at || null,
      authMe: authMeData,
    });
  } catch (err: any) {
    console.error("Minecraft Status API Error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
