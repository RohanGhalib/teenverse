import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ authenticated: false, error: "Unauthorized" }, { status: 401 });
    }

    // 1. Fetch current profile
    const { data: userProfile } = await supabase
      .from("teenverse_users")
      .select("minecraft_username")
      .eq("id", session.id)
      .maybeSingle();

    if (!userProfile?.minecraft_username) {
      return NextResponse.json({ error: "No Minecraft username is currently linked." }, { status: 400 });
    }

    const previousIGN = userProfile.minecraft_username;
    const lowerIGN = previousIGN.toLowerCase();

    // 2. Delete row from AuthMe table so user cannot log in to server until linked again
    try {
      const { error: authMeDeleteErr } = await supabase
        .from("authme")
        .delete()
        .eq("username", lowerIGN);

      if (authMeDeleteErr) {
        console.warn("Notice deleting authme row during unlink:", authMeDeleteErr.message);
      }
    } catch (authMeErr: any) {
      console.warn("AuthMe delete catch notice:", authMeErr?.message);
    }

    // 3. Clear minecraft_username in teenverse_users
    const { error: updateErr } = await supabase
      .from("teenverse_users")
      .update({
        minecraft_username: null,
        minecraft_linked_at: null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", session.id);

    if (updateErr) {
      return NextResponse.json({ error: "Failed to unlink Minecraft account." }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: `Minecraft username "${previousIGN}" disconnected and removed from server login database.`,
    });
  } catch (err: any) {
    console.error("Minecraft Unlink API Error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
