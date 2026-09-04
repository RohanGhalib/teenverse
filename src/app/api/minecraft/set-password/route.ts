import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { hashAuthMeSha256 } from "@/lib/authmePassword";

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ authenticated: false, error: "Unauthorized" }, { status: 401 });
    }

    const { newPassword } = await req.json().catch(() => ({}));

    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters long." }, { status: 400 });
    }

    // 1. Get user profile
    const { data: userProfile } = await supabase
      .from("teenverse_users")
      .select("minecraft_username")
      .eq("id", session.id)
      .maybeSingle();

    if (!userProfile?.minecraft_username) {
      return NextResponse.json(
        { error: "No Minecraft account connected to your Teenverse profile. Please link your account first." },
        { status: 400 }
      );
    }

    const lowerIGN = userProfile.minecraft_username.toLowerCase();
    const passwordHash = hashAuthMeSha256(newPassword);

    // 2. Update AuthMe row
    const { error: authMeErr } = await supabase
      .from("authme")
      .update({
        password: passwordHash,
      })
      .eq("username", lowerIGN);

    if (authMeErr) {
      console.error("Failed to update AuthMe password:", authMeErr);
      return NextResponse.json({ error: "Failed to update Minecraft server password." }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Minecraft server password updated successfully! You can now use this password in-game (/login).",
    });
  } catch (err: any) {
    console.error("Set Minecraft Password API Error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
