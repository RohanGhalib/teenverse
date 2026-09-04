import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { hashAuthMeSha256 } from "@/lib/authmePassword";

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ authenticated: false, error: "Unauthorized. Please log in first." }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const { minecraftUsername, inGamePassword } = body;

    if (!minecraftUsername || typeof minecraftUsername !== "string") {
      return NextResponse.json({ error: "Minecraft username is required." }, { status: 400 });
    }

    const cleanUsername = minecraftUsername.trim();

    // Standard Minecraft Java edition username validation (3-16 chars, a-z, 0-9, _)
    if (!/^[a-zA-Z0-9_]{3,16}$/.test(cleanUsername)) {
      return NextResponse.json(
        { error: "Invalid Minecraft username. Must be 3-16 characters containing letters, numbers, and underscores only." },
        { status: 400 }
      );
    }

    const lowerIGN = cleanUsername.toLowerCase();

    // 1. Fetch user profile & check if this IGN is already linked to another Teenverse user
    const { data: currentUserProfile } = await supabase
      .from("teenverse_users")
      .select("id, minecraft_username")
      .eq("id", session.id)
      .maybeSingle();

    if (currentUserProfile?.minecraft_username && currentUserProfile.minecraft_username.toLowerCase() !== lowerIGN) {
      try {
        await supabase
          .from("authme")
          .delete()
          .eq("username", currentUserProfile.minecraft_username.toLowerCase());
      } catch (delErr: any) {
        console.warn("Notice removing old IGN row from authme:", delErr?.message);
      }
    }

    const { data: existingUser, error: checkErr } = await supabase
      .from("teenverse_users")
      .select("id, account_id, email, first_name")
      .ilike("minecraft_username", cleanUsername)
      .neq("id", session.id)
      .maybeSingle();

    if (checkErr && checkErr.code !== "PGRST116") {
      console.warn("Notice checking existing user mc username:", checkErr.message);
    }

    if (existingUser) {
      return NextResponse.json(
        { error: `The Minecraft username "${cleanUsername}" is already connected to another Teenverse account.` },
        { status: 409 }
      );
    }

    // 2. Check AuthMe table in Supabase
    let authMeSuccess = true;
    try {
      const { data: existingAuthMe } = await supabase
        .from("authme")
        .select("id, username")
        .eq("username", lowerIGN)
        .maybeSingle();

      if (!existingAuthMe) {
        // Insert new record in AuthMe
        const passwordHash = inGamePassword && inGamePassword.length >= 4
          ? hashAuthMeSha256(inGamePassword)
          : hashAuthMeSha256("teenverse2026");

        await supabase.from("authme").insert({
          username: lowerIGN,
          realname: cleanUsername,
          password: passwordHash,
          email: session.email,
          ip: "127.0.0.1",
          lastlogin: Date.now(),
        });
      } else {
        // Update existing row
        const updatePayload: any = {
          email: session.email,
          realname: cleanUsername,
        };
        if (inGamePassword && inGamePassword.length >= 4) {
          updatePayload.password = hashAuthMeSha256(inGamePassword);
        }

        await supabase
          .from("authme")
          .update(updatePayload)
          .eq("username", lowerIGN);
      }
    } catch (authMeErr: any) {
      console.warn("AuthMe table sync notice (proceeding with user profile link):", authMeErr?.message);
      authMeSuccess = false;
    }

    // 3. Update Teenverse user record
    const { data: updatedProfile, error: updateErr } = await supabase
      .from("teenverse_users")
      .update({
        minecraft_username: cleanUsername,
        minecraft_linked_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", session.id)
      .select()
      .single();

    if (updateErr) {
      console.error("Failed to update teenverse_users with Minecraft username:", updateErr);
      return NextResponse.json(
        { error: "Failed to link Minecraft username to Teenverse profile.", details: updateErr.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Minecraft username "${cleanUsername}" successfully linked to your Teenverse account!`,
      minecraftUsername: cleanUsername,
      authMeSynced: authMeSuccess,
      user: updatedProfile,
    });
  } catch (err: any) {
    console.error("Minecraft Link API Error:", err);
    return NextResponse.json({ error: "Internal server error linking Minecraft account.", details: err.message }, { status: 500 });
  }
}
