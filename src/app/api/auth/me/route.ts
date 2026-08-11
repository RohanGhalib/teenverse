import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest, fetchFullUserProfile } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req);

    if (!session) {
      return NextResponse.json(
        { authenticated: false, message: "No active Teenverse session found." },
        { status: 401 }
      );
    }

    // Fetch complete profile from Supabase
    const userProfile = await fetchFullUserProfile(session.id);

    // Fetch user's volunteer applications
    const { data: applications } = await supabase
      .from("volunteer_applications")
      .select("*")
      .eq("email", session.email)
      .order("submitted_at", { ascending: false });

    // Fetch user's event registrations
    const { data: eventRegistrations } = await supabase
      .from("event_registrations")
      .select("*, events(*)")
      .eq("user_id", session.id);

    // Fetch user's badges
    const { data: badges } = await supabase
      .from("user_badges")
      .select("*")
      .eq("user_id", session.id);

    return NextResponse.json({
      authenticated: true,
      session,
      user: userProfile || {
        id: session.id,
        account_id: session.accountId,
        email: session.email,
        roles: session.roles,
      },
      applications: applications || [],
      events: eventRegistrations || [],
      badges: badges || [],
    });
  } catch (err: any) {
    console.error("Auth Me API Error:", err);
    return NextResponse.json(
      { authenticated: false, error: "Failed to retrieve user session.", details: err.message },
      { status: 500 }
    );
  }
}
