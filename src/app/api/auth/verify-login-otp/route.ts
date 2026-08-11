import { NextRequest, NextResponse } from "next/server";
import { verifyOtpCode } from "@/lib/otpStore";
import { supabase } from "@/lib/supabase";
import { signSessionToken, setSessionCookie } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json(
        { error: "Email and OTP code are required." },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();

    // 1. Verify OTP code
    const isValid = verifyOtpCode(cleanEmail, otp);

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid or expired OTP code. Please check your inbox or request a new code." },
        { status: 400 }
      );
    }

    // 2. Fetch existing user record
    const { data: user, error: userErr } = await supabase
      .from("teenverse_users")
      .select("*")
      .eq("email", cleanEmail)
      .maybeSingle();

    if (!user) {
      // User has verified email but doesn't have a profile yet
      return NextResponse.json({
        success: true,
        isNewUser: true,
        email: cleanEmail,
        message: "Email verified successfully! Please complete your Teenverse account profile or volunteer application.",
      });
    }

    // 3. Update last_login_at timestamp
    await supabase
      .from("teenverse_users")
      .update({
        email_verified: true,
        last_login_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    // 4. Create central JWT Session Token
    const rolesArray = user.roles || (user.role ? [user.role] : ["teen_member"]);
    const token = await signSessionToken({
      id: user.id,
      accountId: user.account_id,
      email: user.email,
      roles: rolesArray,
    });

    const response = NextResponse.json({
      success: true,
      isNewUser: false,
      user: {
        id: user.id,
        accountId: user.account_id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        roles: rolesArray,
        primaryDomain: user.primary_domain,
        city: user.city,
        avatarUrl: user.avatar_url,
      },
      token,
      message: "Successfully logged in to Teenverse Account!",
    });

    // 5. Set HTTP-only Cookie
    setSessionCookie(response, token);

    return response;
  } catch (err: any) {
    console.error("Verify Login OTP Error:", err);
    return NextResponse.json(
      { error: "Failed to authenticate OTP.", details: err.message },
      { status: 500 }
    );
  }
}
